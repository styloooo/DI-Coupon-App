//Base app, middleware declarations
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//Routes
var routes = require('./routes');
var index = require('./routes/index');
var users = require('./routes/users');
var businesses = require('./routes/businesses');
var deals = require('./routes/deals');
var categories = require('./routes/categories');
var signup = require('./routes/signup');
var logout = require('./routes/logout')

//Authentication and User middleware
var passport = require('passport');
var flash = require('connect-flash');

//Configuration ==================================
//connect to our DB for auth
require('./config/passport')(passport);

var db = require('./db/db').connection;

var app = express();
app.set('appName', 'coupon-app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//MIDDLEWARE ===================================


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//required for passport
app.use(session({
        secret: 'tylerdavisisamazing',
        resave: true,
        saveUninitialized: true
} )); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(flash()); //use connect-flash for flash messages stored in session

//ROUTES =====================================================

app.use('/', index);
app.use('/deals', deals);
app.use('/businesses', businesses);
app.use('/category', categories);
app.use('/login', users);
app.use('/logout', logout);
app.use('/signup', signup);

app.get('/auth/facebook', 
  passport.authenticate('facebook'),
  function (req, res){
  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/'}),
  //Success!
  function (req, res){
    res.redirect('/businesses');
  });

app.all('*', function (req, res) {
  res.sendStatus(404);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function isLoggedIn(req, res, next) {
  //if user is authenticated in session, carry on
  if(req.isAuthenticated())
    return next();

  //If they aren't redirect them to home
  res.redirect('/');
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
