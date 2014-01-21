var Tables = ['user', 'user_info', 'oidc'];

UserStore = function(options){
  if (options.hasOwnProperty('tables')) Tables = options.tables;

  this.pool = options.client.config.connectionConfig ? true : false;
  this.mysql = options.client;
};

UserStore.prototype.query = function(query) {
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

UserStore.prototype.findOrCreate = function(issuer, sub, userInfo, provider, done) {
  var email = userInfo && userInfo.email ? userInfo.email : null;
  if (email) {
    this.query(function(connection, release) {
      connection.query('SELECT * FROM `' + Tables[0] + '` WHERE email = ?', [email], function (err, result) {
        if (result) {
          var user = new Object;
          user.id = result && result[0] && result[0].id ? result[0].id : null;
          user.oidc_id = result && result[0] && result[0].oidc_id ? result[0].oidc_id : null;
          user.sub = result && result[0] && result[0].sub ? result[0].sub : null;
          user.email = result && result[0] && result[0].email ? result[0].email : null;
          user.email_verified = result && result[0] && result[0].email_verified ? result[0].email_verified : null;
          authOrCreateUser(connection, user, issuer, sub, userInfo, provider, done);
        }
        release(connection);
      }).on('error', function (err) {
          done('Cannot select user', null);
        });
    });
  } else {
    done('Cannot select user', null);
  }
};

function authOrCreateUser(connection, user, issuer, sub, userInfo, provider, done) {
  if (!(user && user.id)) {
    user.email = userInfo && userInfo.email ? userInfo.email : null;
    user.email_verified = 0;
    connection.query('INSERT INTO `' + Tables[0] + '` (`sub`, `email`) VALUES(?, ?)', [sub, user.email], function (err, result) {
      if (result) {
        console.log('user inserted...');
        user.id = result.insertId;
        user.sub = sub;
        updateUser(connection, user, issuer, sub, userInfo, provider, done);
      }
    }).on('error', function (err) {
        done('Cannot insert user', null);
      });
  } else {
    updateUser(connection, user, issuer, sub, userInfo, provider, done);
  }
}

function updateUser(connection, user, issuer, sub, userInfo, provider, done) {
  if (issuer) {
    findOidcByIssuer(connection, issuer, function(err, oidc) {
      if (oidc && oidc.id) {
        connection.query('UPDATE `' + Tables[0] + '` SET oidc_id = ?, sub = ? WHERE id = ?', [oidc.id, sub, user.id], function (err, result) {
          if (result) {
            console.log('user updated...');
            user.oidc_id = oidc.id;
            user.sub = sub;

            findUserInfo(connection, user, provider, function(err, user) {
              if (user && user.id) {
                authOrCreateUserInfo(connection, user, userInfo, provider, done);
              } else {
                done('Cannot select user info', null);
              }
            });
          }
        }).on('error', function (err) {
            done('Cannot update user', null);
          });
      } else {
        done('Cannot update user', null);
      }
    });
  } else {
    findUserInfo(connection, user, provider, function(err, user) {
      if (user && user.id) {
        authOrCreateUserInfo(connection, user, userInfo, provider, done);
      } else {
        done('Cannot select user info', null);
      }
    });
  };
}

function findOidcByIssuer(connection, issuer, done) {
  if (issuer) {
    connection.query('SELECT * FROM `' + Tables[2] + '` WHERE issuer = ?', [issuer], function (err, result) {
      if (result) {
        var oidc = new Object;
        oidc.id = result && result[0] && result[0].id ? result[0].id : null;
        oidc.issuer = result && result[0] && result[0].issuer ? result[0].issuer : null;
        oidc.provider = result && result[0] && result[0].provider ? JSON.parse(result[0].provider) : null;
        oidc.registration = result && result[0] && result[0].registration ? JSON.parse(result[0].registration) : null;
        done(null, oidc);
      }
    }).on('error', function (err) {
        done('Cannot select oidc', null);
      });
  } else {
    done('Cannot select oidc', null);
  }
};

function findUserInfo(connection, user, provider, done) {
  if (user && user.id) {
    connection.query('SELECT * FROM `' + Tables[1] + '` WHERE user_id = ? AND provider = ?', [user.id, provider], function (err, result) {
      if (result) {
        user.provider = result && result[0] && result[0].provider ? result[0].provider : null;
        user.display_name = result && result[0] && result[0].display_name ? result[0].display_name : null;
        user.given_name = result && result[0] && result[0].given_name ? result[0].given_name : null;
        user.middle_name = result && result[0] && result[0].middle_name ? result[0].middle_name : null;
        user.family_name = result && result[0] && result[0].family_name ? result[0].family_name : null;
        done(null, user);
      }
    }).on('error', function (err) {
        done('Cannot select user info', null);
      });
  } else {
    done('Cannot select user info', null);
  }
};

function authOrCreateUserInfo(connection, user, userInfo, provider, done) {
  if (!(user && user.provider)) {
    user.provider = provider;
    user.display_name = userInfo && userInfo.displayName ? userInfo.displayName : null;
    user.given_name = userInfo && userInfo.name && userInfo.name.givenName ? userInfo.name.givenName : null;
    user.middle_name = userInfo && userInfo.name && userInfo.name.middleName ? userInfo.name.middleName : null;
    user.family_name = userInfo && userInfo.name && userInfo.name.familyName ? userInfo.name.familyName : null;
    connection.query('INSERT INTO `' + Tables[1] + '` (`user_id`, `provider`, `display_name`, `given_name`, `middle_name`, `family_name`) VALUES(?, ?, ?, ?, ?, ?)', [user.id, user.provider, user.display_name, user.given_name, user.middle_name, user.family_name], function (err, result) {
      if (result) {
        console.log('user info inserted...');
        user.info_id = result.insertId;
        done(null, user);
      }
    }).on('error', function (err) {
        done('Cannot insert user info', null);
      });
  } else {
    console.log('the user is back!');
    done(null, user);
  }
}

module.exports = UserStore;