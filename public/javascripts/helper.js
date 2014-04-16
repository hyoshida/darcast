function imageify($target) {
  $target.find('a').each(function() {
    url = $(this).text();
    if (!url.match(/\.(jpg|jpeg|gif|png)$/)) return;

    $image = $('<img/>').attr('src', url);
    $(this).html($image);
  });
}

function youtubeify($target) {
  $target.find('a').html(function(_, html) {
    var pattern = /(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    if (html.match(pattern)) {
      return '<iframe src="http://www.youtube.com/embed/' + RegExp.$1 + '" frameborder="0" allowfullscreen></iframe>';
    } else {
      return html;
    }
  });
}

function createMessageElement(data) {
  var $name = $('<span/>').attr('class', 'name').text('@' + data.user_display_name);
  var $time = $('<span/>').attr('class', 'time').text(data.created_at);
  var $body = $('<div/>').attr('class', 'body').text(data.message);

  $body.linkify();
  imageify($body);
  youtubeify($body);

  return $('<div/>')
    .attr('class', 'message')
    .append($name)
    .append($time)
    .append($body);
}

function updateCounter() {
  $('#counter').text($('#users li.active').length);
}

function addUserToNav(user) {
  var $user = $('<li/>').attr('data-user-code', user.code).text(user.display_name);
  if (user.active_flag) {
    $user.attr('class', 'active');
    $user.prependTo('#users');
  } else {
    $user.attr('class', 'inactive');
    $user.appendTo('#users');
  }
}

function activateUser(user) {
  var $user = $("#users").find('[data-user-code="' + user.code + '"]');
  if (!$user.length) {
    $user = $('<li/>').attr('data-user-code', user.code).text(user.display_name);
  }
  $user.attr('class', 'active');
  $user.prependTo('#users');
}

function inactivateUser(user) {
  var $user = $("#users").find('[data-user-code="' + user.code + '"]');
  $user.attr('class', 'inactive');
  $user.appendTo('#users');
}
