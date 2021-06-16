var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet')
//Authentication
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
//Dotenv
require('dotenv').config();
//MongoDB
const mongoose = require('mongoose');
//models
const User = require('./models/user')
//Connect to mongoDB
const mongoDB_link = process.env.MONGO_URI;
mongoose.connect(mongoDB_link, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('mongoose connected')
})

//router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))



passport.use(new LocalStrategy(
	function (username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); } //Incorrect username
			else {
				bcrypt.compare(password, user.hashed_password, (err, res) => {
					if (res) { return done(null, user); }
					else if (err) { return done(err) }
					else {
						return done(null, false, { message: "Incorrect password" })
					}
				})
			}
		});
	}
));



passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());


//Helmet and compression:
app.use(compression());
app.use(helmet());

//Locals
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
