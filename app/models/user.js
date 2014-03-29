var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  active_flag: Boolean
});

UserSchema.virtual('attirbutes').get(function() {
  var attributes = this.toJSON();
  delete attributes._id;
  delete attributes.__v;
  return attributes;
});

mongoose.model('User', UserSchema);
