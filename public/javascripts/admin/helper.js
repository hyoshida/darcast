// define `$obj.attr()` method.
// from http://stackoverflow.com/questions/14645806/get-all-attributes-of-an-element-using-jquery
(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);

function addUserToMap(user) {
  // for admin
  var $user_code = $('<dt/>').addClass('code').text(user.code);
  var $user_sep = $('<dd/>').addClass('sep').text('@');
  var $user_name = $('<dd/>').addClass('name').text(user.name || 'Anonymous');

  var $show_field = $('<dl/>').addClass('show_field');
  $show_field.append($user_code);
  $show_field.append($user_sep);
  $show_field.append($user_name);

  var $user_map = $('<div/>').attr('data-user-code', user.code).addClass('user_map');
  $user_map.append($show_field);
  $user_map.appendTo('#users_map');
}

function inputStart(element) {
  $element = $(element);
  $input = $('<input/>').attr($element.attr());
  $input.insertAfter($element);
  $input.focus();
  $input.val($element.text());
  $element.addClass('hidden');

  var ime = new LibIME($input);
  ime.onkeyup = function(args) {
    event = args[0];
    switch (ime.status) {
    case 2:
      if (event.keyCode !== 13) return;
      inputComplete($input);
    }
  }
}

function inputComplete(input) {
  $input = $(input);

  $element = $input.closest('.show_field').find('.hidden');
  $element.removeClass('hidden');

  if ($input.attr('class').match(/code/) && !validateIPaddress($input.val())) {
    $input.remove();
    return;
  }

  $element.text($input.val());
  $element.trigger('change');
  $input.remove();
}

function validateIPaddress(ipaddress) {
  return ipaddress.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
}
