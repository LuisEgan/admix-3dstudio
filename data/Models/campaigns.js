const mongoose = require('mongoose');
const states = require('../Utils/constants').states;

const Schema = mongoose.Schema;

const campaignsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    state: {
      type: String,
      default: 'inactive',
      enum: states,
    },
    name: String,
    advertiser: String,
    description: String,
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true },
);

campaignsSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

module.exports = mongoose.model('Campaign', campaignsSchema);
