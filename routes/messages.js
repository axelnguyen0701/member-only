var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController');
const middleware = require('./middleware')

//Create new message GET:
router.get('/new', middleware.secured, messageController.message_create_get)


//Create new message POST:
router.post('/new', middleware.secured, messageController.message_create_post)


module.exports = router;