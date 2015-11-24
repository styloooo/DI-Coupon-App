var knex = require('knex')({
	client: 'mysql',
	connection: {
		host		: '127.0.0.1',
		user		: 'root',
		password	: 'direct12',
		database	: 'coupon_app',
		charset		: 'utf8'
	}
});

var Schema = require('./schema');
var sequence = require('when/sequence');
var _ = require('lodash');

function createTable(tableName) {

	return knex.schema.createTable(tableName, function(table) {

		var column;
		var columnKeys = _.keys(Schema[tableName]);

		_.each(columnKeys, function(key) {
			var cursor = Schema[tableName][key]
			//creates html column for deals
			//catch decimal column
			if (cursor.type === 'text' && cursor.hasOwnProperty('fieldtype')) {
				column = table[cursor.type](key, cursor.fieldtype);
			}
			else if (cursor.type === 'string' && cursor.hasOwnProperty('maxlength')) {
				column = table[cursor.type](key, cursor.maxlength);
			}
			else if (cursor.type === 'decimal' && cursor.hasOwnProperty('precision') && cursor.hasOwnProperty('scale')) {
				column = table[cursor.type](key, cursor.precision, cursor.scale);
				//column = table[cursor.type](key, cursor.scale);
			}
			else{
				column = table[cursor.type](key);
			}

			if (cursor.hasOwnProperty('nullable') && cursor.nullable === true){
				column.nullable();
			}
			else{
				column.notNullable();
			}

			if (cursor.hasOwnProperty('unique') && cursor.unique){
				column.unique();
			}

			if (cursor.hasOwnProperty('unsigned') && cursor.unsigned){
				column.unsigned();
			}

			if(cursor.hasOwnProperty('defaultTo')) {
				column.defaultTo(cursor.defaultTo);
			}
		})
	});
}

function createTables() {
	var tables = [];
	var tableNames = _.keys(Schema);

	tables = _.map(tableNames, function (tableName) {
		return function() {
			return createTable(tableName);
		};
	});

	return sequence(tables);
}

createTables()
.then(function(){
	console.log('Tables created!!');
	process.exit(0);
})
.otherwise(function(error) {
	throw error;
});