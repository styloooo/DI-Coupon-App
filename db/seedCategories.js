var mysql = require('mysql');
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password: 'direct12',
	database: 'coupon_app'
});

connection.connect();

sql = 'INSERT INTO categories (name) VALUES ("Clothing"), ("Food"), ("Books"), ("School Supplies"), ("Nightlife")';

connection.query(sql, function (err) {
	if(err) console.log(err);
	else{
		console.log('SUCCESS: Categories table seeded!!!');
	}
})

connection.end();