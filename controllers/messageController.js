const Message = require('../models/message')
const { body, validationResult } = require('express-validator');
exports.message_create_get = (req, res, next) => {
	res.render('message_form', { title: 'Message form' })
}

exports.message_create_post = [
	body('title', "Title must not be blank").trim().isLength({ min: 1 }).escape(),
	body('content', "Content must not be blank").trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('message_form', { title: 'Message form', errors: errors.array() });
			return;
		}
		else {
			const message = new Message({
				title: req.body.title,
				content: req.body.content,
				author: req.user
			}).save(err => {
				if (err) { return next(err) };
				res.redirect('/')
			})
		}
	}
]

exports.get_message = (req, res, next) => {
	Message.find()
		.populate('author')
		.exec((err, list_messages) => {
			if (err) return next(err);
			res.render('index', { title: 'Members Only', message_list: list_messages })
			return;
		})
}