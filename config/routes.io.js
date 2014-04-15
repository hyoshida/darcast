var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var sanitize = require('validator');

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
      user.active_flag = false;
      user.save();
      app.io.broadcast('user.disconnect', user.attributes);
      console.log('disconnection: @' + conditions.code);
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
        talks.push({ user_display_name: user.display_name, message: message.body, created_at: datestring(message.created_at) });
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
      var message = new Message({ user: user, body: message_body });
      message.save();

      app.io.broadcast('talk', { user_display_name: user.display_name, message: message_body, created_at: datestring(new Date) });

      console.log('talk: @' + user.code + ' say ' + message_body);
    });
  });

};
