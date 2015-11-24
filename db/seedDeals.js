var mysql = require('mysql');
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password: 'direct12',
	database: 'coupon_app'
});

connection.connect(function(err){
	if(err) console.error(err);
	else console.log('Connected');
});

var sql = 'INSERT INTO deals (title, slug, business_id, description, active_starting, active_ending, category_id, created_at) VALUES ';

function createDeals (sql){
	for(var i = 14; i <= 24; i++){
		sql += '(' + 
			' "Deal ' + (i+11) + '", ' +
			' "deal' + (i+11) + '",' +
			i + ', ' + 
			' "Check out this sweet deal", ' +
			'NOW(), ' +
			'"2016-01-01", ' +
			((i % 5)+13) + ', ' +
			'NOW()' + 
			')';

		if(i != 24) sql += ', ';

	}
	return sql;
}

sql = createDeals(sql);
console.log(sql);
connection.query(sql, function(err) {
	if(err) console.error(err);
	else console.log('Deals seeded!!');
});

connection.end(function(err){
	if(err) console.error(err);
	else console.log('Connection terminated');
})