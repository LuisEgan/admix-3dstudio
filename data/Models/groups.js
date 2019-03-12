const mongoose = require("mongoose");
const states = require("../Utils/constants").states;

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  creatives: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creative",
    },
  ],
  state: {
    type: String,
    default: "inactive",
    enum: states,
  },
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

groupsSchema.virtual("id").get(function idToString() {
  return this._id.toString();
});

module.exports = mongoose.model("Group", groupsSchema);
