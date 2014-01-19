var passport = require('passport');
var OpenidConnectStrategy = require('passport-openidconnect').Strategy;

var CLIENT_NAME;
var SCOPE = 'profile email';
var CALLBACK_URL;
var REDIRECT_URIS;

// Configuration database with oidc and user tables
var Config = {oidc: [], user: []};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function findOidcById(id, fn) {
  for (var i = 0, len = Config.oidc.length; i < len; i++) {
    var oidc = Config.oidc[i];
    if (oidc.id === id) {
      return fn(null, oidc);
    }
  }
  return fn(null, null);
}

function findOidcByIssuer(iss, fn) {
  for (var i = 0, len = Config.oidc.length; i < len; i++) {
    var oidc = Config.oidc[i];
    if (oidc.provider.issuer === iss) {
      return fn(null, oidc);
    }
  }
  return fn(null, null);
}

function findUserByEmail(email, fn) {
  for (var i = 0, len = Config.user.length; i < len; i++) {
    var user = Config.user[i];
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

function save_configuration(identifier, provider, reg, next) {
  var oidc_id = Config.oidc.length + 1;
  Config.oidc.push({id: oidc_id, provider: provider, reg: reg});

  var user_id = Config.user.length + 1;
  Config.user.push({id: user_id, oidc_id: oidc_id, email: identifier});
  return next();
};

function update_configuration(identifier, issuer, done) {
  findOidcByIssuer(issuer, function(err, oidc) {
    if (oidc) {
      var user_id = Config.user.length + 1;
      Config.user.push({id: user_id, oidc_id: oidc.id, email: identifier});

      return done(null, {
        identifier: identifier,
        authorizationURL: oidc.provider.authorizationURL,
        tokenURL: oidc.provider.tokenURL,
        userInfoURL: oidc.provider.userInfoURL,
        clientID: oidc.provider.clientID,
        clientSecret: oidc.reg.clientSecret,
        callbackURL: CALLBACK_URL
      });
    } else {
      return done(err, null);
    }
  });

};

function load_configuration(identifier, done) {
  findUserByEmail(identifier, function(err, user) {
    if (user) {
      findOidcById(user.oidc_id, function(err, oidc) {
        if (oidc) {
          return done(err, {
            identifier: identifier,
            authorizationURL: oidc.provider.authorizationURL,
            tokenURL: oidc.provider.tokenURL,
            userInfoURL: oidc.provider.userInfoURL,
            clientID: oidc.provider.clientID,
            clientSecret: oidc.reg.clientSecret,
            callbackURL: CALLBACK_URL
          });
        } else {
          return done('Oidc not found', null);
        }
      });
    } else {
      return done(err, null);
    }
  })
};

module.exports = function(app) {
  CLIENT_NAME = app.config.oidc.client_name;
  CALLBACK_URL = '/auth/oidc/callback';
  REDIRECT_URIS = [app.config.server.base_url() + CALLBACK_URL];

  var options = {};
  options.name = CLIENT_NAME;
  options.redirectURI = REDIRECT_URIS;

  require('passport-openidconnect').config(update_configuration);

  var registration = require('passport-openidconnect').registration(options, save_configuration);
  require('passport-openidconnect').register(registration);

  var strategy = new OpenidConnectStrategy({
      identifierField: 'resource',
      scope: SCOPE
    },
    function(iss, sub, oidc_profile, accessToken, refreshToken, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        var profile = {displayName: '', name: {}, userInfo: {emails: []}};
        profile.displayName = oidc_profile.displayName;
        profile.name = oidc_profile.name;
        if (oidc_profile.email)
          profile.userInfo.emails.push({value: oidc_profile.email});

        // find or create the user based on their email address
        app.user.findOrCreate({ userInfo: profile.userInfo, provider: 'openidconnect' }, function(err, user) {
          if (err)
            console.log(err);
          done(err, user);
        });

      });
    }
  );

  passport.use(strategy);

  strategy.configure(load_configuration);

  app.get('/auth/oidc/login', passport.authenticate('openidconnect',
    {callbackURL: CALLBACK_URL, failureRedirect: '/login'}),
    function(req, res){
      // The request will be redirected to OIDC provider for authentication, so this
      // function will not be called.
    });

  app.get(CALLBACK_URL, passport.authenticate('openidconnect',
    { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

};
