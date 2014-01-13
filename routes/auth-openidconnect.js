var passport = require('passport');
var OpenidConnectStrategy = require('passport-openidconnect').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = function(app) {

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

  app.get('/auth/oidc/login',  passport.authenticate('openidconnect'));

  app.get('/auth/oidc/login/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/login' }),
    //passport.authenticate('openidconnect', { scope: ['profile', 'email'] }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

};
