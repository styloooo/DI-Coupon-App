var express = require('express');
var router = express.Router();
var db = require('../db/db');


/* 
* GET home page Shows all available deals 
*/ 

router.get('/', function (req, res, next) {
  db.getLatLngActiveDeals(function (err, deals) {
  	console.log(deals);
  	res.render('index', {title: 'Coupon App', deals: deals});

  });
});

module.exports = router;