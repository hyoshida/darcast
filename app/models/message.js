var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  body: String,
  user: { type: ObjectId, ref: 'User' },
  created_at: Date
});

MessageSchema.pre('save', function(next) {
  if (!this.created_at) this.created_at = new Date;
  next();
});

mongoose.model('Message', MessageSchema);
