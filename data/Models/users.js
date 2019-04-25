const mongoose = require('mongoose');
const validator = require('./validators/users');
const bcrypt = require('bcrypt');
const accessGroups = require('../Utils/constants').accessGroups;

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    campaigns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
      },
    ],
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
    company: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      validate: validator.email,
    },
    resetPwd: {
      attempts: {
        type: Number,
        default: 0,
      },
      isRequested: {
        type: Boolean,
        default: false,
      },
    },
    accessGroups: {
      type: String,
      default: 'guest',
      enum: accessGroups,
    },
    password: {
      type: String,
      required: true,
      validate: validator.password,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.post('validate', async (doc, next) => {
  const salt = await bcrypt.genSalt(10);
  doc.password = await bcrypt.hash(doc.password, salt);
  next();
});

userSchema.virtual('id').get(function idToString() {
  return this._id.toString();
});

userSchema.statics.getCampaigns = async function(id) {
  try {
    const { campaigns } = await this.findById(id).populate('campaigns');
    return campaigns;
  } catch (error) {
    console.error('error: ', error);
  }
};

module.exports = mongoose.model('User', userSchema);
