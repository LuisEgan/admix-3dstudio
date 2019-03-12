const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  content: String,
});

postSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

module.exports = mongoose.model('Post', postSchema);
