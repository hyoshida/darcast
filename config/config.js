var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'darcast'
    },
    port: 8000,
    db: 'mongodb://localhost/darcast-development',
    basicAuth: {
      user: 'admin',
      admin: 'darcast123'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'darcast'
    },
    port: 8000,
    db: 'mongodb://localhost/darcast-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'darcast'
    },
    port: 8000,
    db: 'mongodb://localhost/darcast-production',
    basicAuth: {
      user: 'admin',
      admin: 'darcast123'
    }
  }
};

module.exports = config[env];
