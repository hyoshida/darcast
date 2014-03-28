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

  app.io.sockets.on('connection', function(req) {
    user_name = ipaddress(req);

    user = new User({ name: user_name });
    user.save();

    Message.find({}).sort('created_at').populate('user').exec(function(err, messages) {
      var talks = [];
      messages.forEach(function(message) {
        user = message.user;
        talks.push({ user_name: user.name, message: message.body, created_at: datestring(message.created_at) });
      });
      app.io.broadcast('talk.log', talks);
    });

    console.log('connection: @' + user_name);
  });

  app.io.route('talk', function(req) {
    user_name = ipaddress(req);
    User.findOne({ name: user_name }, function(err, user) {
      message_body = sanitize.escape(req.data);

      message = new Message({ user: user, body: message_body });
      message.save();

      app.io.broadcast('talk', { user_name: user_name, message: message_body, created_at: datestring(new Date) });

      console.log('talk: @' + user_name + ' say ' + message_body);
    });
  });

};
