var passport = require('passport');
var OpenidConnectStrategy = require('passport-openidconnect').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = function(app) {

  var options = {};
  options.name = app.config.oidc.client_name;
  options.redirectURI = [];
  options.redirectURI.push(app.config.server.base_url() + '/auth/oidc/login/callback');
  var registration = require('passport-openidconnect').registration(options);
  require('passport-openidconnect').register(registration);

  passport.use(new OpenidConnectStrategy({
      identifierField: 'resource',
      scope: 'profile email'
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // find or create the user based on their email address
        app.user.findOrCreate({ userInfo: profile, provider: 'openidconnect' }, function(err, user) {
          if (err)
            console.log(err);
          done(err, user);
        });

      });
    }
  ));

  app.get('/auth/oidc/login', passport.authenticate('openidconnect', {failureRedirect: '/login'}),
    function(req, res){
      // The request will be redirected to OIDC provider for authentication, so this
      // function will not be called.
    });

  app.get('/auth/oidc/login/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

};
