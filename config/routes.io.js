var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');

module.exports = function(app) {

  function ipaddress(req) {
    return req.handshake.headers['x-forwarded-for'] || req.handshake.address.address;
  }

  app.io.route('ready', function(req) {
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

    console.log('ready: @' + user_name);
  });

  app.io.route('talk', function(req) {
    user_name = ipaddress(req);
    User.findOne({ name: user_name }, function(err, user) {
      message_body = req.data;

      message = new Message({ user: user, body: message_body });
      message.save();

      app.io.broadcast('talk', { user_name: user_name, message: message_body });

      console.log('talk: @' + user_name + ' say ' + message_body);
    });
  });

};
