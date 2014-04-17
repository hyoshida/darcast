$(function() {
  io = io.connect();

  // Listen for user.connect event.
  io.on('user.connect', function(user) {
    activateUser(user);
    updateUserForMap(user);
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
      updateUserForMap(this);
    });
    updateCounter();
  });

  // Listen for user.update event.
  io.on('user.update', function(user) {
    updateUser(user);
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

    updateUserForMap(attributes);
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
    io.emit('user.update', JSON.stringify(attributes));
  });

  $('#revolution button').on('click', function() {
    var $self = $(this);
    var text = $self.text();

    $self.toggleClass('disable');

    if ($self.attr('class').match(/disable/))
      $self.text(text.replace('Enable', 'Disable'));
    else
      $self.text(text.replace('Disable', 'Enable'));

    io.emit('mode.toggle');
  });
});

$(document).on('click', '.show_field :not(input).code, .show_field :not(input).name', function() {
  inputStart(this);
});

$(document).on('blur', '.show_field input.code, .show_field input.name', function() {
  inputComplete(this);
});
