var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../db/db');

router.get('/', function (req, res, next) {
	res.render('signup', {message: req.flash()});
});

router.post('/', passport.authenticate('local-signup',{
	successRedirect: '/businesses',
	failureRedirect: '/signup',
	failureFlash: true
}));

module.exports = router;