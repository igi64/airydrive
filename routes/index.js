var fs = require('fs');

module.exports = function(app){
  require('./auth.js')(app);
  require('./auth-openidconnect.js')(app);
  require('./auth-persona.js')(app);
  require('./auth-google.js')(app);
  require('./auth-yahoo.js')(app);
  require('./auth-saml.js')(app);
  require('./elfinder.js')(app);
};