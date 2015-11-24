var randy = require('randy');
var mysql = require('mysql');

var client = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: 'direct12',
	database	: 'coupon_app'
});

client.connect();

var table = 'businesses';
var sql = 'INSERT INTO ' + table + ' (name, about, email, address, phone, lat, lng)' + 'VALUES '; //+ values;
var count = 10

while(count >= 0){
	//40.1155122,-88.3331332
	var lat = randy.uniform(40,41);
  	var lng = randy.uniform(-87,-89);
	
	sql += '(' +
		' "Test Biz ' + count.toString() + '", ' +
		' "This is a little bio about the company", ' +
		' "testbiz' + count + '@test.com", ' + 
		' "512 E. Green St., Champaign, IL", ' +
		' "2345678901", ' +
		lat + ", " +
		lng + ")";
//(name, email, address, phone, lat, lng) VALUES 
//("Tyler's Business", "tallyndavis@comcast.net", "234 Easy St., Urbana, IL", "9873452", 0, 0);

	if(count != 0) sql += ', ';
	console.log(sql);
	count--;
}

console.log(sql);

client.query(sql, function(err) {
	if(err) console.log(err);
	else console.log(table, " seeded!!!");
	client.end(function() {
	console.log("Connection ended");
	})
});