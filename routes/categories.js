var express = require('express');
var router = express.Router();
var db = require('../db/db');

router.get('/', function (req, res, next) {
	db.getAllCategories(function (err, categories) {
		if(err) return err;
		res.render('categories', {title: 'Categories', categories: categories});
	})
});

router.get('/:id', function (req, res, next) {
	var category_id = req.params.id;
	db.getCategory(category_id, function (err, category) {
		if(err) console.error(err);
		db.getCategoryDeals(category_id, function (err, deals) {
			if(err) console.error(err);
			console.log(category[0]);
			console.log(deals);
			res.render('category', {category: category[0], deals: deals});
		});
	});
});

module.exports = router;