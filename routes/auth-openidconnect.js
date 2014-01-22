var passport = require('passport');
var OpenidConnectStrategy = require('passport-openidconnect').Strategy;

var CLIENT_NAME;
var SCOPE = 'profile email';
var CALLBACK_URL;
var REDIRECT_URIS;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = function(app) {
  CLIENT_NAME = app.config.oidc.client_name;
  CALLBACK_URL = '/auth/oidc/callback';
  REDIRECT_URI = app.config.server.base_url() + CALLBACK_URL;
  REDIRECT_URIS = [REDIRECT_URI];

  function saveConfig(provider, reg, next) {
    app.Oidc.saveConfig(provider, reg, function(err) {
      next(err);
    });
  };

  function loadConfigByIssuer(issuer, done) {
    app.Oidc.loadConfigByIssuer(issuer, function(err, config) {
      done(err, config);
    });
  };

  function loadConfigByIdentifier(identifier, done) {
    app.Oidc.loadConfigByIdentifier(identifier, function(err, config) {
      done(err, config);
    });
  };

  var strategy = new OpenidConnectStrategy({
      identifierField: 'emailField',
      scope: SCOPE
    },
    function(iss, sub, userInfo, accessToken, refreshToken, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // find or create the user based on their email address
        app.User.findOrCreate(iss, sub, userInfo, 'openidconnect', function(err, user) {
          if (err)
            console.log(err);
          done(err, user);
        });

      });
    }
  );

  passport.use(strategy);

  strategy.configure(loadConfigByIdentifier);
  require('passport-openidconnect').config(loadConfigByIssuer);

  var options = {};
  options.name = CLIENT_NAME;
  options.redirectURI = REDIRECT_URIS;

  var registration = require('passport-openidconnect').registration(options, saveConfig);
  require('passport-openidconnect').register(registration);

  app.get('/auth/oidc/login', passport.authenticate('openidconnect',
    {callbackURL: REDIRECT_URI, failureRedirect: '/login'}),
    function(req, res){
      // The request will be redirected to OIDC provider for authentication, so this
      // function will not be called.
    });

  app.get(CALLBACK_URL, passport.authenticate('openidconnect',
    {callbackURL: REDIRECT_URI, failureRedirect: '/login'}),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

};
