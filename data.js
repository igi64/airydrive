var Tables = ['folder', 'folder_link'];

DataStore = function(options){
  if (options.hasOwnProperty('tables')) Tables = options.tables;

  this.pool = options.client.config.connectionConfig ? true : false;
  this.mysql = options.client;
};

DataStore.prototype.query = function(query) {
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

DataStore.prototype.setup = function(rootName, user, done) {
  if (user && user.id) {
    this.query(function(connection, release) {
      connection.query('SELECT * FROM `' + Tables[1] + '` WHERE user_id = ? AND parent_id is NULL', [user.id], function (err, result) {
        if (result) {
          var folder_link = new Object;
          folder_link.id = result && result[0] && result[0].id ? result[0].id : null;
          if (folder_link.id)
            done(null, user);
          else
            createRootFolder(connection, rootName, user, done);
        }
        release(connection);
      }).on('error', function (err) {
          done('Cannot setup user storage', null);
        });
    });
  } else {
    done('Cannot setup user storage', null);
  }
};

function createRootFolder(connection, rootName, user, done) {
  if (user && user.id) {
    var timestamp = Math.round(+new Date()/1000);
    connection.query('INSERT INTO `' + Tables[0] + '` (`owner_id`, `mtime`) VALUES(?, ?)', [user.id, timestamp], function (err, result) {
      if (result) {
        console.log('root folder inserted...');
        var folder = new Object;
        folder.id = result.insertId;
        createRootFolderLink(connection, folder, timestamp, rootName, user, done);
      }
    }).on('error', function (err) {
        done('Cannot setup user storage', null);
      });
  } else {
    done('Cannot setup user storage', null);
  }
}

function createRootFolderLink(connection, folder, timestamp, rootName, user, done) {
  if (folder && folder.id && user && user.id) {
    connection.query('INSERT INTO `' + Tables[1] + '` (`user_id`, `folder_id`, `name`, `mtime`, `read`, `write`) VALUES(?, ?, ?, ?, ?, ?)', [user.id, folder.id, rootName, timestamp, 1, 1], function (err, result) {
      if (result) {
        console.log('root folder_link inserted...');
        done(null, user);
      }
    }).on('error', function (err) {
      done('Cannot setup user storage', null);
    });
  } else {
    done('Cannot setup user storage', null);
  }
}

module.exports = DataStore;