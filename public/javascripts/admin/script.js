$(function() {
  io = io.connect();

  // Listen for user.connect event.
  io.on('user.connect', function(user) {
    activateUser(user);
    addUserToMap(user);
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
      addUserToNav(this);
      addUserToMap(this);
    });
    updateCounter();
  });

  $('form').submit(function(event) {
    // stop form from submitting normally
    event.preventDefault();

    var code = $('input.code').val();
    var name = $('input.name').val();

    if (!validateIPaddress(code)) return;

    var attributes = { code: code, name: name };
    io.emit('user.new', JSON.stringify(attributes));

    $('input').val('');
  });
});

$(document).on('click', '.show_field :not(input).code, .show_field :not(input).name', function() {
  inputStart(this);
});

$(document).on('blur', '.show_field input.code, .show_field input.name', function() {
  inputComplete(this);
});
