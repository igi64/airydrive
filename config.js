exports.config = {
  server: {
    secure: false,
    http_port: 80,
    https_port: 443,
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
  },
  PHP: {
    secure: false,
    host: 'localhost',
    http_port: 8080,
    https_port: 4432,
    elfinder_connector: '/elfinder/php/connector.php',
    base_url: function() {
      return (this.secure ? 'https://' : 'http://') + this.host + ':' + (this.secure ? this.https_port : this.http_port);
    }
  },
  oidc: {
    client_name: 'AiryDrive'
  },
  data: {
    rootName: 'igi64'
  }
}
