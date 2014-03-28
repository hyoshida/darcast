var express = require('express.io'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.match(/\.js$/)) {
    require(modelsPath + '/' + file);
  }
});

var app = express();
app.http().io();

require('./config/express')(app, config);
require('./config/routes')(app);
require('./config/routes.io')(app);

app.listen(config.port);
