const { body, validationResult, check } = require("express-validator");
var User = require('../models/user')
var bcrypt = require('bcryptjs');
const passport = require("passport");
require('dotenv').config();

exports.user_signup_get = (req, res, next) => {
	res.render('sign-up', { title: 'Sign Up', currentUser: req.user });
}

exports.user_signup_post = [

	body('username').exists().withMessage('Must not be blank').trim().isLength({ min: 8 }).withMessage('Must be at least 8 letters').escape().custom((value, { req }) => {
		// Check if user exits already
		return new Promise((resolve, reject) => {
			User.findOne({ username: req.body.username }, function (err, user) {
				if (err) {
					reject(new Error('Server Error'))
				}
				if (Boolean(user)) {
					reject(new Error('E-mail already in use'))
				}
				resolve(true)
			});
		});
	}).withMessage('User already exists'),

	body('first_name').trim().isLength({ min: 1 }).escape(),

	body('last_name').trim().isLength({ min: 1 }).escape(),

	body('password', 'Password must be at least 8 letters').isLength({ min: 8 }),

	check('passwordConfirmation', 'passwordConfirmation filed must have the same value as the password field').exists().custom((value, { req }) => value === req.body.password),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render('sign-up', { title: 'Sign Up', errors: errors.array() })
			return;
		}
		else {
			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) return next(err)
				// otherwise, store hashedPassword in DB
				const user = new User({
					username: req.body.username,
					hashed_password: hashedPassword,
					first_name: req.body.first_name,
					last_name: req.body.last_name
				}).save(err => {
					if (err) {
						return next(err)
					}
					res.redirect('/');
				})
			});
		}
	}
]

exports.user_login_get = (req, res, next) => {
	res.render('login', { title: "Login" })
}

exports.user_login_post = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/sign-up"
})


exports.user_logout = (req, res) => {
	req.logout();
	res.redirect('/')
}

exports.user_upgrade_get = (req, res, next) => {
	res.render('upgrade_form', { title: "Upgrade Membership" })
}

exports.user_upgrade_post = [
	body('passcode', 'Must not be blank').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.render('upgrade_form', { title: 'Upgrade Membership', errors: errors.array() })
			return;

		}
		else {
			if (req.body.passcode === process.env.PASSCODE) {
				User.findByIdAndUpdate(req.user._id, { member_status: "Admin" })
					.exec((err, user) => {
						if (err) return next(err);
						else { console.log("Updated User: ", user); res.redirect('/') }
					})
			}
			else {
				res.render('upgrade_form', { title: "Upgrade Memebership", errors: [{ msg: 'Wrong password' }] })
			}
		}

	}
]
