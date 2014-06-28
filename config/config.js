var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'anpub-chat'
    },
    port: 8000,
    db: 'mongodb://localhost/anpub-chat-development',
    basicAuth: {
      user: 'admin',
      admin: 'anpub123'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'anpub-chat'
    },
    port: 8000,
    db: 'mongodb://localhost/anpub-chat-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'anpub-chat'
    },
    port: 8000,
    db: 'mongodb://localhost/anpub-chat-production',
    basicAuth: {
      user: 'admin',
      admin: 'anpub123'
    }
  }
};

module.exports = config[env];
