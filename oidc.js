var Tables = ['oidc', 'user'];

OidcStore = function(options){
  if (options.hasOwnProperty('tables')) Tables = options.tables;

  this.pool = options.client.config.connectionConfig ? true : false;
  this.mysql = options.client;
};

OidcStore.prototype.query = function(query) {
  var pool = this.pool;
  var release = function(connection) {
    if (pool) connection.release();
  }
  if (pool) {
    this.mysql.getConnection(function(err, connection) {
      if (err) throw err;
      query(connection, release);
    });
  } else {
    query(this.mysql, release);
  }
};

OidcStore.prototype.saveConfig = function(prov, reg, done) {
  if (prov && prov.issuer && reg) {
    var issuer = prov.issuer;
    var provider = JSON.stringify(prov);
    var registration = JSON.stringify(reg);
    this.query(function(connection, release) {
      connection.query('INSERT INTO `' + Tables[0] + '` (`issuer`, `provider`, `registration`) VALUES(?, ?, ?)', [issuer, provider, registration], function (err, result) {
        if (result) {
          console.log('oidc configuration inserted...');
          //oidc.id = result.insertId;
          done(null);
        }
        release(connection);
      }).on('error', function (err) {
          console.log('Cannot insert oidc configuration');
          done('Cannot insert oidc configuration');
        });
    });
  } else {
    console.log('Cannot insert oidc configuration');
    done('Cannot insert oidc configuration');
  }
};

OidcStore.prototype.loadConfigByIssuer = function(issuer, done) {
  if (issuer) {
    this.query(function(connection, release) {
    connection.query('SELECT * FROM `' + Tables[0] + '` WHERE TRIM(TRAILING "/" FROM issuer) = TRIM(TRAILING "/" FROM ?)', [issuer], function (err, result) {
      if (result) {
        var provider = result && result[0] && result[0].provider ? JSON.parse(result[0].provider) : null;
        var registration = result && result[0] && result[0].registration ? JSON.parse(result[0].registration) : null;
        var config = provider && registration ? new Object : null;
        if (config) {
          config.authorizationURL = provider.authorizationURL;
          config.tokenURL = provider.tokenURL;
          config.userInfoURL = provider.userInfoURL;
          config.clientID = registration.clientID;
          config.clientSecret = registration.clientSecret;
        }
        done(null, config);
      }
      release(connection);
    }).on('error', function (err) {
        console.log('Cannot select oidc configuration');
        done('Cannot select oidc configuration', null);
      });
    });
  } else {
    done(null, null);
  }
};

OidcStore.prototype.loadConfigByIdentifier = function(identifier, done) {
  this.query(function(connection, release) {
    findUserByEmail(connection, identifier, function(err, user) {
      var issuer_id = user && user.issuer_id ? user.issuer_id : null;
      if (issuer_id) {
        connection.query('SELECT * FROM `' + Tables[0] + '` WHERE id = ?', [issuer_id], function (err, result) {
          if (result) {
            var provider = result && result[0] && result[0].provider ? JSON.parse(result[0].provider) : null;
            var registration = result && result[0] && result[0].registration ? JSON.parse(result[0].registration) : null;
            var config = provider && registration ? new Object : null;
            if (config) {
              config.authorizationURL = provider.authorizationURL;
              config.tokenURL = provider.tokenURL;
              config.userInfoURL = provider.userInfoURL;
              config.clientID = registration.clientID;
              config.clientSecret = registration.clientSecret;
            }
            done(null, config);
          }
          release(connection);
        }).on('error', function (err) {
            console.log('Cannot select oidc configuration');
            done('Cannot select oidc configuration', null);
          });
      } else {
        done(null, null);
      }
    });
  });
};

function findUserByEmail(connection, email, done) {
  if (email) {
    connection.query('SELECT * FROM `' + Tables[1] + '` WHERE email = ?', [email], function (err, result) {
      if (result) {
        var user = new Object;
        user.issuer_id = result && result[0] && result[0].issuer_id ? result[0].issuer_id : null;
        done(null, user);
      }
    }).on('error', function (err) {
        done('Cannot select user', null);
      });
  } else {
    done('Cannot select user', null);
  }
};

module.exports = OidcStore;