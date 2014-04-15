var share = require('../../config/share.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
  display_real_name_flag: { type: Boolean, default: false }
});

var Setting = mongoose.model('Setting', SettingSchema);

// 1. Set the setting value into a global variable
// 2. Insert a new record if records was not exist
Setting.findOne({}, function(err, setting) {
  if (err) return;

  if (setting) {
    share.display_real_name_flag = setting.display_real_name_flag;
  } else {
    share.display_real_name_flag = false;
    new Setting().save();
  }
});
