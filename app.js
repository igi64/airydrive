var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var util = require('util');
var fs = require('fs');
var config = require('./config').config;
var mysql = require('mysql').createPool(config.mysql);
var MySQLStore = require('connect-mysql')(express);
var UserStore = require("./user.js");
var OidcStore = require("./oidc.js");

var User = new UserStore({ client: mysql, tables: ['tb_user', 'tb_user_info', 'tb_oidc'] });
var Oidc = new OidcStore({ client: mysql, tables: ['tb_oidc', 'tb_user'] });

var ssl_key = fs.readFileSync('keys/ssl.key');
var ssl_cert = fs.readFileSync('keys/ssl.crt');
var ssl_ca = fs.readFileSync('keys/signing-ca-1.crt');

var ssl_options = {
  key: ssl_key,
  cert: ssl_cert,
  ca: ssl_ca
};

var app_redirect = express();

app_redirect.configure(function() {
  app_redirect.set('port', process.env.PORT || 80);
  app_redirect.use(express.favicon(__dirname + '/public/favicon.ico'));
  app_redirect.use(app_redirect.router);
});

var app = express();

var passport = require('passport');

app.config = config;
app.User = User;
app.Oidc = Oidc;

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
    maxAge: 60*5000 //5 minutes
  },
  rolling : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes')(app);

app.use(function(req, res) {
  res.render('403.ejs', {title: '403: Forbidden'});
});

app.use(function(req, res) {
  res.render('404.ejs', {title: '404: Page Not Found'});
});

app.use(function(error, req, res, next) {
  res.render('500.ejs', {title:'500: Internal Server Error', error: error});
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app_redirect.get('*', function(req, res) {
  res.redirect(config.server.base_url() + req.url)
});

if (config.server.secure) {
  http.createServer(app_redirect).listen(app_redirect.get('port'), function(){
    console.log('Express http server listening on port ' + app_redirect.get('port'));
  });

  https.createServer(ssl_options, app).listen(app.get('port'), function(){
    console.log('Express https server listening on port ' + app.get('port'));
  });
} else {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express http server listening on port " + app.get('port'));
  });
}
