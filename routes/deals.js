var express = require('express');
var router = express.Router();
var db = require('../db/db');

router.get('/:id', function (req, res, next){
  //Fix up these queries
  db.getDeal(req.params.id, function (err, deals) {
    if(err) return err;
    db.getBiz(deals[0].business_id, function (err, businesses) {
      if(err) return err;
      db.getCategory(deals[0].category_id, function (err, category) {
        if(err) return err;
        res.render('deal', {deal: deals[0], business: businesses[0], category: category[0]});
      })
    })
  });
});

router.get('/', function(req, res, next) {
  db.getAllDeals(function (err, deals){
    if(err) return err;
    var activeBusinesses = [];
    for(var i = 0; i < deals.length; i++){
      activeBusinesses.push(deals[i].business_id);
    }
    //Remove duplicates
    activeBusinesses = db.removeDupes(activeBusinesses);
    db.getBiz(activeBusinesses, function (err, businesses){
      if(err) return err;
      res.render('deals', { title: 'Coupon App', message: 'Hola!', deals: deals, businesses: businesses});
    });
  });
});

module.exports = router;