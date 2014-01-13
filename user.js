var TableName = 'user';

UserStore = function(options){
  if (options.hasOwnProperty('table')) TableName = options.table;

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
      connection.query('SELECT * FROM `' + TableName + '` WHERE email = ?', [email], function (err, result) {
        if (result) {
          authOrCreate(connection, result, data.userInfo, done);
        }
        release(connection);
      }).on('error', function (err) {
          done('Cannot create user', null);
        });
    });
  } else {
    done('Cannot create user', null);
  }
};

function authOrCreate(connection, data, userInfo, done) {
  if (!(data && data[0] && data[0].email)) {
    var user = new Object;
    user.id = 0;
    user.email = userInfo && userInfo.emails.length > 0 ? userInfo.emails[0].value : null;
    user.email_verified = 0;
    user.given_name = userInfo && userInfo.name && userInfo.name.givenName ? userInfo.name.givenName : null;
    user.family_name = userInfo && userInfo.name && userInfo.name.familyName ? userInfo.name.familyName : null;
      connection.query('INSERT INTO `' + TableName + '` (`email`, `given_name`, `family_name`) VALUES(?, ?, ?)', [user.email, user.given_name, user.family_name], function (err, result) {
        if (result) {
          console.log('user inserted...');
          user.id = result.insertId;
          done(null, user);
        }
      }).on('error', function (err) {
          done('Cannot insert user', null);
        });
  } else {
    console.log('the user is back!');
    done(null, data[0]);
  }
}

module.exports = UserStore;