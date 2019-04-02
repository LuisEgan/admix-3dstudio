const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    maxUploadSize: Number,
  },
  { timestamps: true },
);

settingsSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

module.exports = mongoose.model('Settings', settingsSchema);
