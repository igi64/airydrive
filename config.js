exports.config = {
  server: {
    secure: false,
    host: 'localhost.airydrive.org',
    cookie_parser: 'your cookie secret here',
    session_secret: 'your session secret here',
    base_url: function() {
      return (this.secure ? 'https://' : 'http://') + this.host;
    }
  },
  mysql: {
    host: '192.168.100.200',
    port: 3306,
    user: 'airydrive',
    password: 'apassword',
    database: 'airydrive'
  }
}
