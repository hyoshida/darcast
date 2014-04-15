var share = require('../../config/share.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  code: String,
  name: String,
  active_flag: Boolean
});

UserSchema.virtual('attributes').get(function() {
  var attributes = this.toJSON();
  delete attributes._id;
  delete attributes.__v;
  attributes.display_name = this.display_name;
  return attributes;
});

UserSchema.virtual('display_name').get(function() {
  if (share.display_real_name_flag) {
    return this.name || this.code;
  } else {
    return this.code;
  }
});

mongoose.model('User', UserSchema);
