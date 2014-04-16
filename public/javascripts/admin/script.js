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

  $(document).on('change', '.show_field :not(input).code, .show_field :not(input).name', function() {
    var $self = $(this);
    var code = $self.closest('[data-user-code]').attr('data-user-code');
    var attributes = { code: code, value: $self.text() };
    if ($self.attr('class').match(/code/)) {
      attributes.type = 'code';
    } else {
      attributes.type = 'name';
    }
    io.emit('user.edit', JSON.stringify(attributes));
  });
});

$(document).on('click', '.show_field :not(input).code, .show_field :not(input).name', function() {
  inputStart(this);
});

$(document).on('blur', '.show_field input.code, .show_field input.name', function() {
  inputComplete(this);
});
