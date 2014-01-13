module.exports = function(app) {

  app.get('/', ensureAuthenticated, function(req, res){
    res.render('index', { user: req.user });
  });

  app.get('/login', function(req, res){
    res.render('login', { app: app, user: req.user });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }

};