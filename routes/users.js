var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var middleware = require('./middleware')
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get('/:userId', (req, res, next) => {
	res.send(req.params.userId)
})

router.get('/:userId/upgrade', middleware.secured, userController.user_upgrade_get)

router.post('/:userId/upgrade', middleware.secured, userController.user_upgrade_post)
module.exports = router;
