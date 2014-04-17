var config = require('../../config/config');
var share = require('../../config/share');

exports.index = function(req, res) {
  res.render('admin/index', { share: share });
};
