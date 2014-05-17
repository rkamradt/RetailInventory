"use strict";


var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    User = require('./user'),
    authroutes = require('./authroutes'),
    approutes = require('./approutes'),
    port = process.env.PORT || 5000,
    realm = 'http://localhost'; 

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username, password: password }, function (err, user) {
      done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.set('port', port);
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser()); // required before session.
app.use(session({ secret: 'omgwtf', name: 'sid', cookie: { secure: true }}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash);
app.use('/',approutes(express,ensureAuthenticated));
app.use('/auth',authroutes(express,passport));
app.use('/', express.static(path.join(__dirname, 'static')));

app.use(errorHandler());

mongoose.connect('mongodb://localhost/RetailInventory');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

      
http.createServer(app).listen(app.get('port'), function() {
  console.log('Server up: http://localhost:' + app.get('port'));
});
    
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}