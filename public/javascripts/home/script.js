$(function() {
  io = io.connect();

  // Listen for talk event.
  io.on('talk', function(data) {
    var $message = createMessageElement(data);
    $('#messages').prepend($message);
  });

  // Listen for talk.log event.
  io.on('talk.log', function(data) {
    $.each(data, function() {
      var $message = createMessageElement(this);
      $('#messages').prepend($message);
    });
  });

  // Listen for user.connect event.
  io.on('user.connect', function(user) {
    activateUser(user);
    updateCounter();
  });

  // Listen for user.disconnect event.
  io.on('user.disconnect', function(user) {
    inactivateUser(user);
    updateCounter();
  });

  // Listen for user.log event.
  io.on('user.log', function(users) {
    $.each(users, function() {
      updateUser(this);
    });
    updateCounter();
  });

  // Listen for user.update event.
  io.on('user.update', function(user) {
    updateUser(user);
    updateCounter();
  });

  // Emit talk event.
  $('form').submit(function(event) {
    // stop form from submitting normally
    event.preventDefault();

    message = $('input').val();
    if (message.length) {
      io.emit('talk', message);
      $('input').val('');
    }
  });
});
