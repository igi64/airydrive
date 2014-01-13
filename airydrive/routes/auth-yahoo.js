var passport = require('passport');
var YahooStrategy = require('passport-yahoo').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = function(app) {

  passport.use(new YahooStrategy({
      returnURL: app.config.server.base_url() + '/auth/yahoo/login/return',
      realm: app.config.server.base_url()
    },
    function(identifier, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // find or create the user based on their email address
        app.user.findOrCreate({ userInfo: profile, provider: 'yahoo' }, function(err, user) {
          if (err)
            console.log(err);
          done(err, user);
        });

      });
    }
  ));

  app.get('/auth/yahoo/login',
    passport.authenticate('yahoo', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/auth/yahoo/login/return',
    passport.authenticate('yahoo', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

};
