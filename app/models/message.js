var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  body: String,
  user: { type: ObjectId, ref: 'User' }
});

mongoose.model('Message', MessageSchema);
