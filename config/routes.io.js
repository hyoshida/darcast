var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var Setting = mongoose.model('Setting');
var sanitize = require('validator');
var share = require('../config/share');
var fs = require('fs');
var crypto = require('crypto');
var exec = require('child_process').exec;
var path = require('path');

module.exports = function(app) {

  function ipaddress(req) {
    return req.handshake.headers['x-forwarded-for'] || req.handshake.address.address;
  }

  function zeropadding(num, count) {
    return (Array(count).join('0') + num).slice(-count);
  }

  function datestring(datetime) {
    var padding = 2;
    var year = datetime.getFullYear();
    var month = zeropadding(datetime.getMonth() + 1, padding); // Months are zero based
    var day = zeropadding(datetime.getDate(), padding);
    var hours = zeropadding(datetime.getHours(), padding);
    var minutes = zeropadding(datetime.getMinutes(), padding);
    var seconds = zeropadding(datetime.getSeconds(), padding);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  function userConnect(conditions) {
    User.findOne(conditions, function (err, user) {
      if (!user) {
        user = new User(conditions);
      }
      user.active_flag = true;
      user.save();
      app.io.broadcast('user.connect', user.attributes);
      console.log('connection: @' + conditions.code);
    });
  }

  function userDisconnect(conditions) {
    User.findOne(conditions, function (err, user) {
      if (!user) return;
      user.active_flag = false;
      user.save();
      app.io.broadcast('user.disconnect', user.attributes);
      console.log('disconnection: @' + conditions.code);
    });
  }

  function root() {
    // from http://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    return path.dirname(require.main.filename);
  }

  function say(message) {
    var wav_file_name = crypto.createHash('md5').update(message, 'utf8').digest('hex') + '.wav';
    var wav_file_path = root() + '/public/' + share.media_path + '/' + wav_file_name;
    make_wave_file(message, wav_file_path, function() {
      app.io.broadcast('say', { wav_file_path: '/' + share.media_path + '/' + wav_file_name });
    });
  }

  function make_wave_file(message, wav_file_path, callback) {
    if (fs.existsSync(wav_file_path)) {
      callback();
      return;
    }
    // TODO: escape command injection
    exec("cd " + root() + " && echo '" + message + "' | " + share.yukkuri_bin + " > " + wav_file_path, function (err, stdout, stderr) {
      if (err) console.log(err);
      callback();
    });
  }

  app.io.sockets.on('connection', function(req) {
    var user_code = ipaddress(req);

    userConnect({ code: user_code });

    User.find({ code: { $ne: user_code } }, function(err, users) {
      var users_attributes = [];
      users.forEach(function(user) {
        users_attributes.push(user.attributes);
      });
      req.emit('user.log', users_attributes);
    });

    Message.find({}).sort('created_at').populate('user').exec(function(err, messages) {
      var talks = [];
      messages.forEach(function(message) {
        var user = message.user;
        talks.push({ user: user.attributes, message: message.body, created_at: datestring(message.created_at) });
      });
      req.emit('talk.log', talks);
    });

    req.on('disconnect', function() {
      var user_code = ipaddress(this);
      userDisconnect({ code: user_code });
    });
  });

  app.io.route('talk', function(req) {
    var message_body = sanitize.escape(req.data);
    if (!message_body.length) return;

    var user_code = ipaddress(req);
    User.findOne({ code: user_code }, function(err, user) {
      if (!user) return;

      var message = new Message({ user: user, body: message_body });
      message.save();

      app.io.broadcast('talk', { user: user.attributes, message: message_body, created_at: datestring(new Date) });
      say(message_body);

      console.log('talk: @' + user.code + ' say ' + message_body);
    });
  });

  app.io.route('user.new', function(req) {
    var attributes = null;
    try {
      attributes = JSON.parse(req.data);
    } catch (e) {
      console.error("JSON.parse error:", e);
    }
    if (!attributes) return;
    if (!attributes.code) return;

    User.findOne({ code: attributes.code }, function(err, user) {
      if (user) {
        console.log('user.new: @' + user.code + ' is already exist');
        return;
      }
      user = new User();
      user.code = attributes.code;
      user.name = attributes.name;
      user.save();
    });
  });

  app.io.route('user.update', function(req) {
    var attributes = null;
    try {
      attributes = JSON.parse(req.data);
    } catch (e) {
      console.error("JSON.parse error:", e);
    }
    if (!attributes) return;

    User.findOne({ code: attributes.code }, function(err, user) {
      if (attributes.type == 'code') {
        user.code = attributes.value;
      } else {
        user.name = attributes.value;
      }
      user.save();
      app.io.broadcast('user.update', user.attributes);
    });
  });

  app.io.route('mode.toggle', function(req) {
    share.display_real_name_flag = !share.display_real_name_flag;
    Setting.findOne({}, function(err, setting) {
      if (!setting) return;
      setting.display_real_name_flag = share.display_real_name_flag;
      setting.save();

      User.find({}, function(err, users) {
        var users_attributes = [];
        users.forEach(function(user) {
          users_attributes.push(user.attributes);
        });
        app.io.broadcast('user.log', users_attributes);
      });
    });
  });

  app.io.route('suside', function(req) {
    Message.remove({}, function(err) {
      console.log('*ALL Message REMOVED*')
    });
    User.remove({}, function(err) {
      console.log('*ALL User REMOVED*')
    });
  });
};
