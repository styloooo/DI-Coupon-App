var config = require('./oauth.js');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//user model
var mysql = require('mysql');
var dbconfig = require('./db').connection;
var connection = mysql.createConnection(dbconfig.connection);
var bcrypt = require('bcrypt-nodejs');

connection.query('USE ' + dbconfig.database);

function validateEmail(email){
	var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;
	return re.test(email);
}

//Expose function to our app using module exports
module.exports = function (passport) {
	//======================================
	//Passport session setup ===============
	//======================================
	//Required for persistent login sessions
	//Passport needs ability to serialize 
	//and unserialize users out of session

	//Serializes user for session
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	//Deserializes user
	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	/*
	* Passport signup strategies
	*/

	//Facebook
	passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: "http://localhost:3000/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done){
		console.log('Looking for user...');
		connection.query('SELECT * FROM users WHERE oauthID = ?', profile.id, function (err, user) {
			console.log(profile.id);
			if(err) console.log(err);
			if(!err && user.length > 0){
				done(null, user);
			}
			else{
				console.log('Not found. Inserting...');
				connection.query('INSERT INTO users (oauthID, platform) VALUES (?, ?)', [profile.id, 'facebook'], function (err, rows){
					if(err) console.log(err);
					else{
						console.log('Saving user...');
						done(null, user);
					}
				});
			}
		});	
	}));

	//======================================
	//Local signup =========================
	//======================================
	//We are using strategies since we have one 
	//for login and one for signup 
	//By default, if there was no name it would
	//just be called 'local'

	passport.use('local-signup', new LocalStrategy({
		//by default, local strategy uses username and password
		//we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true //allows us to pass back entire request to callback
	},
	function (req, username, password, done) { //Callback with email and passowrd from our form
		
		connection.query('SELECT * FROM users WHERE email = ?', [username], function (err, rows) {
			if(err)
				return done(err);
			if(rows.length){
				return done(null, false, req.flash('emailTaken', 'This email or username has already been registered.')); //req.flash is the way to set flashdata using connect-flash
			}
			//Email should validate
			if(!validateEmail(username)){
				return done(null, false, req.flash('error', 'Please enter a valid email address.'))
			}
			else{
				//if there is no user with that email
				//create
				var newUserMysql = {
					email: username,
					password: bcrypt.hashSync(password, null, null) //use the generate hash function in our user model
				};

				var insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

				connection.query(insertQuery, [newUserMysql.email, newUserMysql.password], function (err, rows) {
					if(err) console.log(err);
					newUserMysql.id = rows.insertId;

					return done(null, newUserMysql);
					});
				}
			});
		})
	);

	/*
	* Passport login handling
	*/

	//=====================================================
	//LOCAL LOGIN =========================================
	//=====================================================
	//We are using named strategies since we have one for login 
	//and one for signup. By default, if there was no name, it 
	//would just be called 'local'.

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true //allows us to pass back the entire request to the callback
	},
	function (req, email, password, done) {//callback with email and password from our form
		connection.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows){
			if(err)
				return done(err);
			if(rows.length < 1){
				return done(null, false, req.flash('loginMessage', 'No user found.')); //req.flash is the way to set flash data using connect-flash
			}

			//If the user is found but the password is wrong
			if(!bcrypt.compareSync(password, rows[0].password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); //create the loginMessage and save it to session
			
			//all is well, return successful user
			return done(null, rows[0]);
			});
		})
	);
};