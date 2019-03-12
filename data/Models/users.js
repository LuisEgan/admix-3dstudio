const mongoose = require("mongoose");
const accessGroups = require("../Utils/constants").accessGroups;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  company: String,
  email: {
    value: String,
    isVerified: Boolean,
  },
  resetPwd: {
    attempts: Number,
    isRequested: Boolean,
  },
  accessGroups: {
    type: String,
    default: "guest",
    enum: accessGroups,
  },
});

userSchema.virtual("id").get(function idToString() {
  return this._id.toString();
});

module.exports = mongoose.model("User", userSchema);
