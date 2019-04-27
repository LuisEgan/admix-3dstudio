const mongoose = require('mongoose');
const states = require('../Utils/constants').states;

const Schema = mongoose.Schema;

const FBXSchema = new Schema({
  tag: { type: String },
  url: { type: String },
  key: { type: String },
});

const FBXSchemaModel = new Schema({
  tag: { type: String },
  url: { type: String },
  key: { type: String },
  size: { type: String },
});

const UploadsSchema = new Schema({
  model: { type: FBXSchemaModel },
  gaze: { type: FBXSchema },
  action: { type: FBXSchema },
});

const creativesSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    name: String,
    sourceURL: String,
    thumbURL: String,
    format: String,
    deleted: { type: Boolean, default: false },
    state: {
      type: String,
      default: 'inactive',
      enum: states,
    },
    size: Number,
    IAB: String,
    uploads: UploadsSchema,
  },
  { timestamps: true },
);

creativesSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

creativesSchema.statics.getGroup = async function(id) {
  try {
    const { group } = await this.findById(id).populate('group');
    return group;
  } catch (error) {
    console.error('error: ', error);
  }
};

module.exports = mongoose.model('Creative', creativesSchema);
