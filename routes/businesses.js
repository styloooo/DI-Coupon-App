var express = require('express');
var router = express.Router();
var db = require('../db/db');

/*
* GET businesses listing
*/
router.get('/', function (req, res, next) {
	var listing = [];
	db.getAllBusinesses(function (err, results){
		if(err) return err;
		for(var i = 0; i < results.length; i++){
			listing.push(results[i]);
			//console.log(listing);
		}
		res.render('businesses', {listing: listing});
	});
});

/*
* GET individual business listing
*/
router.get('/:id', function (req, res, next) {
	db.getBiz(req.params.id, function (err, business) {
		if(err) return err;
		db.getBizDeals(req.params.id, function (err, deals) {
			if(err) return err;
			var category_ids = [];
			for(var i = 0; i < deals.length; i++){
				category_ids.push(deals[i].category_id);
			}
			category_ids = db.removeDupes(category_ids);
			db.getCategory(category_ids, function (err, categories) {
				res.render('business', {business: business[0], deals: deals, categories: categories});
			});
		});
	});
});

module.exports = router;