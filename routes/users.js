var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function (req, res, next) {
  	res.render('login', {message: req.flash()});
});

/* POST login */
router.post('/', passport.authenticate('local-login', {
	successRedirect: '/businesses',
	failureRedirect: '/login',
	failureFlash : true
	}),

	function (req, res) {
		console.log("hello");

		if(req.body.remember){
			req.session.cookie.maxAge = 1000 * 60 * 3;
		}
		else{
			req.session.cookie.expires = false;
		}
	}
);

module.exports = router;