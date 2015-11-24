var Schema = {

	//Tables
	businesses: {
		//Columns
		id: {type: 'increments', nullable: false, primary: true},
		name: {type: 'string', maxlength: 100, nullable: false, unique: true},
		about: {type: 'string', maxlength: 200, nullable: true},
		email: {type: 'string', maxlength: 100, nullable: false, unique: true},
		address: {type: 'string', maxlength: 100, nullable: false},
		phone: {type: 'string', maxlength: 10, nullable: false},
		url: {type: 'string', maxlength: 100, nullable: true, unique: true},
		lat: {type: 'decimal', precision: 10, scale: 8, nullable: false},
		lng: {type: 'decimal', precision: 11, scale: 8, nullable: false} 
	},

	//This is the table for native users (login w/o Facebook)
	users: {
		id: {type: 'increments', nullable: false, primary: true},
		name: {type: 'string', nullable: false},
		email: {type: 'string', maxlength: 100, nullable: false, unique: true},
		username: {type: 'string', maxlenth: 25, nullable:false, unique: true}
		//password
		//username
	},

	//This is where we'll eventually implement OAuth users (Facebook)

	//Each deal has one category
	categories: {
		id: {type: 'increments', nullable: false, primary: true},
		name: {type: 'string', maxlength: 150, nullable: false}
	},

	deals: {
		id: {type: 'increments', nullable: false, primary: true},
		title: {type: 'string', maxlength: 200, nullable: false},
		slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
		business_id: {type: 'integer', nullable: false, unsigned: true},
		description: {type: 'string', maxlength: 200, nullable: false},
		active_starting: {type: 'dateTime', nullable: false},
		active_ending: {type: 'dateTime', nullable: false},
		category_id: {type: 'integer', nullable: false},
		tag_id: {type: 'integer', nullable: true},
		html: {type: 'text', maxlength: 16777215, fieldtype: 'medium', nullable: false},
		created_at: {type: 'dateTime', nullable: false},
		updated_at: {type: 'dateTime', nullable: true}
	},
	
	//Each deal can have more than one tag
	tags: {
		id: {type: 'increments', nullable: false, primary: true},
		slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
		name: {type: 'string', maxlength: 150, nullable: false}
	},

	//This is the table for deals that users have selected
	deals_users: {
		id: {type: 'increments', nullable: false, primary: true},
		deal_id: {type: 'integer', nullable: false, unsigned: true},
		user_id: {type: 'integer', nullable: false, unsigned: true}
	},

	//This is the table for tags assigned to deals
	deals_tags: {
		id: {type: 'increments', nullable: false, primary: true},
		deal_id: {type: 'integer', nullable: false, unsigned: true},
		tag_id: {type: 'integer', nullable: false, unsigned: true}
	}
};

module.exports = Schema;