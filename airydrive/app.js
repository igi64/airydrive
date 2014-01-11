var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var util = require('util');
var OidcStrategy = require('passport-openidconnect').Strategy;
var PersonaStrategy = require('passport-persona').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var YahooStrategy = require('passport-yahoo').Strategy;
var SamlStrategy = require('passport-saml').Strategy;

var mysql = require('mysql').createPool({ host: '192.168.100.200', port: 3306, user: 'airydrive', password: 'apassword', database: 'airydrive' });
var MySQLStore = require('connect-mysql')(express);

var UserStore = require("./user.js");
var User = new UserStore({ client: mysql, table: 'tb_user' });

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the BrowserID verified email address
//   is serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the OidcStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an Issuer, User ID, User profile,
//   accessToken and refreshToken), and invoke a callback with a user object.
// https://localhost.airybox.org/auth/oidc?resource=acct:admin@leadict.com
passport.use(new OidcStrategy({
    identifierField: 'resource',
    scope: 'profile email'
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // find or create the user based on their email address
      User.findOrCreate({ userInfo: profile, provider: 'openidconnect' }, function(err, user) {
        if (err)
          console.log(err);
        done(err, user);
      });

    });
  }
));

// Use the PersonaStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a BrowserID verified email address), and invoke
//   a callback with a user object.
passport.use(new PersonaStrategy({
    audience: 'http://localhost.airybox.org'
  },
  function(email, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      var profile = {userInfo: {emails: []}};
      profile.userInfo.emails.push({value: email});

      // find or create the user based on their email address
      User.findOrCreate({ userInfo: profile.userInfo, provider: 'persona' }, function(err, user) {
        if (err)
          console.log(err);
        done(err, user);
      });

    });
  }
));

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost.airybox.org/auth/google/login/return',
    realm: 'http://localhost.airybox.org/'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // find or create the user based on their email address
      User.findOrCreate({ userInfo: profile, provider: 'google' }, function(err, user) {
        if (err)
          console.log(err);
        done(err, user);
      });

    });
  }
));

// Use the YahooStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new YahooStrategy({
    returnURL: 'http://localhost.airybox.org/auth/yahoo/login/return',
    realm: 'http://localhost.airybox.org/'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // find or create the user based on their email address
      User.findOrCreate({ userInfo: profile, provider: 'yahoo' }, function(err, user) {
        if (err)
          console.log(err);
        done(err, user);
      });

    });
  }
));

passport.use(new SamlStrategy({
    path: '/auth/saml/login/callback',
    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    //issuer: 'http://localhost.airybox.org/',
    issuer: 'localhost-airybox-org-saml',
    protocol: 'http://',
    cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqhkiG9w0BAQUFADCBiTELMAkGA1UEBhMCTk8xEjAQBgNVBAgTCVRyb25kaGVpbTEQMA4GA1UEChMHVU5JTkVUVDEOMAwGA1UECxMFRmVpZGUxGTAXBgNVBAMTEG9wZW5pZHAuZmVpZGUubm8xKTAnBgkqhkiG9w0BCQEWGmFuZHJlYXMuc29sYmVyZ0B1bmluZXR0Lm5vMB4XDTA4MDUwODA5MjI0OFoXDTM1MDkyMzA5MjI0OFowgYkxCzAJBgNVBAYTAk5PMRIwEAYDVQQIEwlUcm9uZGhlaW0xEDAOBgNVBAoTB1VOSU5FVFQxDjAMBgNVBAsTBUZlaWRlMRkwFwYDVQQDExBvcGVuaWRwLmZlaWRlLm5vMSkwJwYJKoZIhvcNAQkBFhphbmRyZWFzLnNvbGJlcmdAdW5pbmV0dC5ubzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt8jLoqI1VTlxAZ2axiDIThWcAOXdu8KkVUWaN/SooO9O0QQ7KRUjSGKN9JK65AFRDXQkWPAu4HlnO4noYlFSLnYyDxI66LCr71x4lgFJjqLeAvB/GqBqFfIZ3YK/NrhnUqFwZu63nLrZjcUZxNaPjOOSRSDaXpv1kb5k3jOiSGECAwEAATANBgkqhkiG9w0BAQUFAAOBgQBQYj4cAafWaYfjBU2zi1ElwStIaJ5nyp/s/8B8SAPK2T79McMyccP3wSW13LHkmM1jwKe3ACFXBvqGQN0IbcH49hu0FKhYFM/GPDJcIHFBsiyMBXChpye9vBaTNEBCtU3KjjyG0hRT2mAQ9h+bkPmOvlEo/aH0xR68Z9hw4PF13w=='/*,
   privateCert: fs.readFileSync('./cert.pem', 'utf-8')*/
  },
  function(saml_profile, done) {
    console.log("Auth with", saml_profile);
    if (!saml_profile.email) {
      return done(new Error("No email found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {

      var profile = {userInfo: {emails: []}};
      profile.userInfo.emails.push({value: saml_profile.email});

      // find or create the user based on their email address
      User.findOrCreate({ userInfo: profile.userInfo, provider: 'persona' }, function(err, user) {
        if (err)
          console.log(err);
        done(err, user);
      });

    });
  }
));

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
  secret: 'keyboard cat',
  store: new MySQLStore({ client: mysql, table: 'tb_session' }),
  cookie: {
    //secure: true,
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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/oidc/login',  passport.authenticate('openidconnect'));

app.get('/auth/oidc/login/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/' }),
  //passport.authenticate('openidconnect', { scope: ['profile', 'email'] }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.post('/auth/browserid/login',
  passport.authenticate('persona', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/google/login',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/google/login/return',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/yahoo/login',
  passport.authenticate('yahoo', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/yahoo/login/return',
  passport.authenticate('yahoo', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/saml/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });

app.post('/auth/saml/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
