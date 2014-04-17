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

function updateUserForMap(user) {
  var $user_map = $('#users_map [data-user-code="' + user.code + '"]');
  if ($user_map.length) {
    $user_map.find('.name').text(user.name);
    return;
  }

  var $user_code = $('<dt/>').addClass('code').text(user.code);
  var $user_sep = $('<dd/>').addClass('sep').text('@');
  var $user_name = $('<dd/>').addClass('name').text(user.name);

  var $show_field = $('<dl/>').addClass('show_field');
  $show_field.append($user_code);
  $show_field.append($user_sep);
  $show_field.append($user_name);

  $user_map = $('<div/>').attr('data-user-code', user.code).addClass('user_map');
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

  var imekeycount = 0;
  var ime = new LibIME($input);
  ime.onkeyup = function(args) {
    event = args[0];
    switch (event.keyCode) {
    // Enter
    case 13:
      if (ime.status == 2) inputComplete($input);
      break;
    // Esc
    case 27:
      if (imekeycount == 0) inputCancel($input);
      imekeycount = 0;
      return;
    }

    switch (ime.status) {
    case 0: imekeycount += 1; break;
    case 1: imekeycount = 0; break;
    }
  }
}

function inputComplete(input, input_cancel_flag) {
  input_cancel_flag = input_cancel_flag || false;
  var $input = $(input);
  var value = $.trim($(input).val());

  $element = $input.closest('.show_field').find('.hidden');
  $element.removeClass('hidden');

  var code_invalid_flag = $input.attr('class').match(/code/) && !validateIPaddress(value);
  var input_blank_flag = (value.length == 0);
  input_cancel_flag = input_cancel_flag || code_invalid_flag || input_blank_flag;

  if (!input_cancel_flag) {
    $element.text(value);
    $element.trigger('change');
  }

  $input.remove();
}

function inputCancel(input) {
  inputComplete(input, true);
}

function validateIPaddress(ipaddress) {
  return ipaddress.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
}
