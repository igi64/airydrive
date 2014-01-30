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
    function(identifier, userInfo, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        if (!userInfo.email && userInfo.emails && userInfo.emails.length > 0) {
          userInfo.email = userInfo.emails[0].value;
        }

        // find or create the user based on their email address
        app.User.findOrCreate(null, null, userInfo, 'yahoo', function(err, user) {
          if (err) {
            console.log(err);
            done(err, user);
          } else {
            app.Data.setup(app.config.data.rootName, user, function(err, user) {
              done(err, user);
            });
          }
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
