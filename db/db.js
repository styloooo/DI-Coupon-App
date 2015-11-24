
//DB configuration
var mysql = require("mysql");
var poolConfig = require('../config/db.js').poolConfig;

var pool = mysql.createPool(poolConfig);

//Sets up a connection with the pool
// exports.getConnection = function(callback) {
// 	pool.getConnection(function(err, connection) {
// 		callback(err, connection);
// 	});
// };

//Queries the database for all rows of the businesses table and stores in callback
exports.getAllBusinesses = function(callback) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from businesses',
			function (err, results) {
				if(err) return callback(err);
				callback(null, results);
			});
		//connection.release();
		});
};

//Queries the database for businesses that belong to id
exports.getBiz = function (id, callback) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * FROM businesses WHERE id IN (' + id + ')', 
			function (err, rows) {
				if(err){
					callback(err, null);
				}
				else{
					//console.log(rows);
					callback(null, rows);
				}
			});
		connection.release();
	})
};

exports.getAllDeals = function(callback) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * FROM deals WHERE active_starting <= CURRENT_DATE()+1 AND active_ending >= CURRENT_DATE()',
			function (err, rows) {
				if(err){
					callback(err, null);
				}
				else{
					callback(null, rows);
				}
			});
		connection.release();
	})
};

exports.getDeal = function(id, callback) {
	pool.getConnection(function (err, connection){
		if(err) return err;
		connection.query('SELECT * FROM deals WHERE id IN (' + id + ')',
			function (err, rows) {
				if(err){
					//console.log(err);
					callback(err, null);
				}
				else{
					//console.log(rows);
					callback(null, rows);
				}
			});
		connection.release();
	});
};

exports.getAllCategories = function(callback) {
	pool.getConnection(function (err, connection) {
		if(err) return callback(err, null);
		connection.query('SELECT * FROM categories', function (err, rows) {
			if(err){
				callback(err, null);
			}
			else{
				callback(null, rows);
			}
		});
		connection.release();
	});
};

exports.getCategory = function(id, callback) {
	pool.getConnection(function (err, connection) {
		if(err) return callback(err, null);
		connection.query('SELECT * FROM categories WHERE id IN (' + id + ')', 
			function (err, rows) {
				if(err){
					callback(err, null);
				}
				else{
					callback(null, rows);
				}
			})
	});
};

//Returns deals that belong to this category
exports.getCategoryDeals = function(id, callback) {
	pool.getConnection(function (err, connection) {
		if(err) return callback(err, null);
		connection.query('SELECT * FROM deals WHERE category_id = ?', id,
			function (err, rows) {
				if(err){
					callback(err, null);
				}
				else{
					callback(null, rows);
				}
			});
		connection.release();
	});
};

//Returns active deals that belong to this business
exports.getBizDeals = function(id, callback) {
	pool.getConnection(function (err, connection){
		if(err) return callback(err, null);
		connection.query('SELECT * FROM deals WHERE business_id = ' + id + ' AND active_ending >= CURRENT_DATE() AND active_starting <= CURRENT_DATE()+1;', 
			function (err, rows) {
				if(err){
					callback(err, null);
				}
				else{
					callback(null, rows);
				}
			});
		connection.release();
	});
};

exports.getLatLngActiveDeals = function(callback) {
	pool.getConnection(function (err, connection) {
		if(err) return callback(err, null);
		connection.query('SELECT businesses.lat, businesses.lng, deals.title, deals.id FROM businesses AS businesses INNER JOIN deals AS deals ON businesses.id = deals.business_id WHERE active_ending >= CURRENT_DATE() AND active_starting <= CURRENT_DATE()+1;',
			function (err, rows) {
				if(err){
					return callback(err, null);
				}
				else{
					return callback(null, rows);
				}
			});
		
		connection.release();
	});
};

//Removes duplicate IDs prior to query
exports.removeDupes = function(idArr) {
	var temp = new Array();
	idArr.sort();
	for(var i = 0; i < idArr.length; i++){
		if(idArr[i]==idArr[i+1]) continue;
		temp[temp.length]=idArr[i];
	}
	return temp;
};