var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'anpub-chat'
    },
    port: 3000,
    db: 'mongodb://localhost/anpub-chat-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'anpub-chat'
    },
    port: 3000,
    db: 'mongodb://localhost/anpub-chat-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'anpub-chat'
    },
    port: 3000,
    db: 'mongodb://localhost/anpub-chat-production'
  }
};

module.exports = config[env];
