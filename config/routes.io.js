var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var sanitize = require('validator');

module.exports = function(app) {

  function ipaddress(req) {
    return req.handshake.headers['x-forwarded-for'] || req.handshake.address.address;
  }

  app.io.sockets.on('connection', function(req) {
    user_name = ipaddress(req);

    user = new User({ name: user_name });
    user.save();

    Message.find({}).populate('user').exec(function(err, messages) {
      var talks = [];
      messages.forEach(function(message) {
        user = message.user;
        talks.push({ user_name: user.name, message: message.body });
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

      app.io.broadcast('talk', { user_name: user_name, message: message_body });

      console.log('talk: @' + user_name + ' say ' + message_body);
    });
  });

};
