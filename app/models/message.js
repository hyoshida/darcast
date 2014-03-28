var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  body: String,
  user: { type: ObjectId, ref: 'User' },
  created_at: Date
});

MessageSchema.set('capped', { max: 5000 });
MessageSchema.pre('save', function(next) {
  if (!this.created_at) this.created_at = new Date;
  next();
});

var Message = mongoose.model('Message', MessageSchema);
Message.collection.isCapped(function (err, isCapped) {
  if (err) throw new Error('failed to create a capped collection');
});
