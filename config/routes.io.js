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

  function userConnect(attributes) {
    User.findOne(attributes, function (err, user) {
      if (!user) {
        user = new User(attributes);
      }
      user.active_flag = true;
      user.save();
      app.io.broadcast('user.connect', attributes);
      console.log('connection: @' + attributes.name);
    });
  }

  function userDisconnect(attributes) {
    User.findOne(attributes, function (err, user) {
      user.active_flag = false;
      user.save();
      app.io.broadcast('user.disconnect', attributes);
      console.log('disconnection: @' + attributes.name);
    });
  }

  app.io.sockets.on('connection', function(req) {
    var user_name = ipaddress(req);

    userConnect({ name: user_name });

    User.find({ name: { $ne: user_name } }, function(err, users) {
      var users_attributes = [];
      users.forEach(function(user) {
        users_attributes.push(user.attirbutes);
      });
      req.emit('user.log', users_attributes);
    });

    Message.find({}).sort('created_at').populate('user').exec(function(err, messages) {
      var talks = [];
      messages.forEach(function(message) {
        var user = message.user;
        talks.push({ user_name: user.name, message: message.body, created_at: datestring(message.created_at) });
      });
      req.emit('talk.log', talks);
    });

    req.on('disconnect', function() {
      var user_name = ipaddress(this);
      userDisconnect({ name: user_name });
    });
  });

  app.io.route('talk', function(req) {
    var message_body = sanitize.escape(req.data);
    if (!message_body.length) return;

    var user_name = ipaddress(req);
    User.findOne({ name: user_name }, function(err, user) {
      var message = new Message({ user: user, body: message_body });
      message.save();

      app.io.broadcast('talk', { user_name: user_name, message: message_body, created_at: datestring(new Date) });

      console.log('talk: @' + user_name + ' say ' + message_body);
    });
  });

};
