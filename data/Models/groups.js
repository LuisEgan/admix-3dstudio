const mongoose = require('mongoose');
const states = require('../Utils/constants').states;

const Schema = mongoose.Schema;

const groupsSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    creatives: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Creative',
      },
    ],
    state: {
      type: String,
      default: 'inactive',
      enum: states,
    },
    name: String,
    description: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

groupsSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

groupsSchema.statics.getCampaign = async function(id) {
  try {
    const { campaign } = await this.findById(id).populate('campaign');
    return campaign;
  } catch (error) {
    console.error('error: ', error);
  }
};

groupsSchema.statics.getCreatives = async function(id) {
  try {
    const { creatives } = await this.findById(id).populate('creatives');
    return creatives;
  } catch (error) {
    console.error('error: ', error);
  }
};

module.exports = mongoose.model('Group', groupsSchema);
