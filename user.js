var Tables = ['user', 'user_info'];

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

UserStore.prototype.findOrCreate = function(data, done) {
  var email = data && data.userInfo && data.userInfo.emails.length > 0 ? data.userInfo.emails[0].value : null;
  if (email) {
    this.query(function(connection, release) {
      connection.query('SELECT * FROM `' + Tables[0] + '` WHERE email = ?', [email], function (err, result) {
        if (result) {
          var user = new Object;
          user.id = result && result[0] && result[0].id ? result[0].id : null;
          user.email = result && result[0] && result[0].email ? result[0].email : null;
          user.email_verified = result && result[0] && result[0].email_verified ? result[0].email_verified : null;
          authOrCreateUser(connection, user, data.provider, data.userInfo, done);
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

function authOrCreateUser(connection, user, provider, userInfo, done) {
  if (!(user && user.id)) {
    user.email = userInfo && userInfo.emails.length > 0 ? userInfo.emails[0].value : null;
    user.email_verified = 0;
    connection.query('INSERT INTO `' + Tables[0] + '` (`email`) VALUES(?)', [user.email], function (err, result) {
      if (result) {
        console.log('user inserted...');
        user.id = result.insertId;
        authOrCreateUserInfo(connection, user, provider, userInfo, done);
      }
    }).on('error', function (err) {
        done('Cannot insert user', null);
      });
  } else {
    connection.query('SELECT * FROM `' + Tables[1] + '` WHERE user_id = ? AND provider = ?', [user.id, provider], function (err, result) {
      if (result) {
        user.provider = result && result[0] && result[0].provider ? result[0].provider : null;
        user.given_name = result && result[0] && result[0].given_name ? result[0].given_name : null;
        user.family_name = result && result[0] && result[0].family_name ? result[0].family_name : null;
        authOrCreateUserInfo(connection, user, provider, userInfo, done);
      }
    }).on('error', function (err) {
        done('Cannot select user info', null);
      });
  }
}

function authOrCreateUserInfo(connection, user, provider, userInfo, done) {
  if (!(user && user.provider && user.provider)) {
    user.provider = provider;
    user.given_name = userInfo && userInfo.name && userInfo.name.givenName ? userInfo.name.givenName : null;
    user.family_name = userInfo && userInfo.name && userInfo.name.familyName ? userInfo.name.familyName : null;
    connection.query('INSERT INTO `' + Tables[1] + '` (`user_id`, `provider`, `given_name`, `family_name`) VALUES(?, ?, ?, ?)', [user.id, user.provider, user.given_name, user.family_name], function (err, result) {
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