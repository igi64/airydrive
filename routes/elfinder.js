var http = require('http');
request = require('request');

module.exports = function(app) {

  app.all('/connector.js', function(req, res){
    var PHP_HOST = app.config.PHP.base_url();
    var phpUrl = req.url.replace('/connector.js', app.config.PHP.elfinder_connector);

    var user_id = -1;

    if (req.user && req.user.id) {
      user_id = req.user.id;
    } else {
      res.write('{"error" : ["errSessionExpires"]}', 'utf8');
      res.end();
      return;
    }

    if (req.url.indexOf('user_id=') == -1) {
      if (phpUrl.indexOf('?') == -1)
        phpUrl += '?user_id=' + user_id;
      else
        phpUrl += '&user_id=' + user_id;
    } else {
      res.write('{"error" : ["errAccess"]}', 'utf8');
      res.end();
      return;
    }

    req.pipe(request[req.method.toLowerCase()](PHP_HOST + phpUrl), {end: true}).pipe(res, {end: true});

  });

};
