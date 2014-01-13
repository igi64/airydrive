var express = require('express');
var http = require('http');
var path = require('path');
var util = require('util');
var config = require('./config').config;
var mysql = require('mysql').createPool(config.mysql);
var MySQLStore = require('connect-mysql')(express);
var UserStore = require("./user.js");

var User = new UserStore({ client: mysql, table: 'tb_user' });

var app = express();

var passport = require('passport');

app.config = config;
app.user = User;

// all environments
app.set('port', process.env.PORT || (config.server.secure ? 443 : 80));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.server.cookie_parser));
app.use(express.session({
  secret: config.server.session_secret,
  store: new MySQLStore({ client: mysql, table: 'tb_session' }),
  cookie: {
    secure: (config.server.secure ? true : false),
    //expires: new Date(Date.now() + 60 * 5000), //5 minutes
    maxAge: 60*5000 //5 minutes
  },
  rolling : true
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes')(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
