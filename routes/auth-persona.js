var express = require('express');
var passport = require('passport');
var PersonaStrategy = require('passport-persona').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = function(app) {

  passport.use(new PersonaStrategy({
      audience: app.config.server.base_url()
    },
    function(email, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        var userInfo = {email: email};

        // find or create the user based on their email address
        app.User.findOrCreate(null, null, userInfo, 'persona', function(err, user) {
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

  app.post('/auth/browserid/login', express.urlencoded(),
    passport.authenticate('persona', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

};
