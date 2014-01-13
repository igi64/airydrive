var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});

module.exports = function(app) {

  passport.use(new GoogleStrategy({
      returnURL: app.config.server.base_url() + '/auth/google/login/return',
      realm: app.config.server.base_url()
    },
    function(identifier, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // find or create the user based on their email address
        app.user.findOrCreate({ userInfo: profile, provider: 'google' }, function(err, user) {
          if (err)
            console.log(err);
          done(err, user);
        });

      });
    }
  ));

  app.get('/auth/google/login',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/auth/google/login/return',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

};
