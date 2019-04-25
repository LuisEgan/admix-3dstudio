const mongoose = require('mongoose');
const states = require('../Utils/constants').states;

const Schema = mongoose.Schema;

const campaignsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    state: {
      type: String,
      default: 'inactive',
      enum: states,
    },
    name: String,
    advertiser: String,
    deleted: { type: Boolean, default: false },
    description: String,
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true },
);

campaignsSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

campaignsSchema.statics.getUser = async function(id) {
  try {
    const { user } = await this.findById(id).populate('user');
    return user;
  } catch (error) {
    console.error('error: ', error);
  }
};

campaignsSchema.statics.getGroups = async function(id) {
  try {
    const { groups } = await this.findById(id).populate('groups');
    return groups;
  } catch (error) {
    console.error('error: ', error);
  }
};

module.exports = mongoose.model('Campaign', campaignsSchema);
