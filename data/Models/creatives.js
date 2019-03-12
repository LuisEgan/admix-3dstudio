const mongoose = require("mongoose");
const states = require("../Utils/constants").states;

const Schema = mongoose.Schema;

const creativesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  name: String,
  sourceURL: String,
  thumbURL: String,
  format: String,
  state: {
    type: String,
    default: "inactive",
    enum: states,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  size: Number,
  IAB: String,
});

creativesSchema.virtual("id").get(function idToString() {
  return this._id.toString();
});

module.exports = mongoose.model("Creative", creativesSchema);