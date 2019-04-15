const { GraphQLString, GraphQLID, GraphQLBoolean, GraphQLNonNull } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');
const GroupsModel = require('../Models/groups');
const CreativesModel = require('../Models/creatives');
const UsersModel = require('../Models/users');

const AddCampaignToUser = async (campaign, user) => {
  const userModified = await UsersModel.findByIdAndUpdate(user, {
    $push: { campaigns: campaign },
  });

  return userModified;
};

const RemoveCreativeFromGroup = async (creative, groups) => {
  group = Array.isArray(group) ? group : [group];
  return await GroupsModel.updateMany(
    {
      _id: { $in: groups },
    },
    {
      $pull: { creatives: creative },
    },
  );
};

const storeFS = ({ stream, filename }) => {
  const filePath = path.join(__dirname, '..', '..', `./uploads/${filename}`);
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file.
          fs.unlinkSync(filePath);
        reject(error);
      })
      .pipe(fs.createWriteStream(filePath))
      .on('error', error => reject(error))
      .on('finish', () => resolve(filePath)),
  );
};

const CleanByCampaign = async campaign => {
  if (!campaign) return null;
  const groups = await GroupsModel.find({ campaign: campaign });
  const creativeIds = groups.map(group => group.creatives).flat();
  const groupsIds = groups.map(group => group._id);
  await CreativesModel.updateMany(
    {
      _id: {
        $in: creativeIds,
      },
    },
    {
      $pull: {
        groups: {
          $in: groupsIds,
        },
      },
    },
  );
  await GroupsModel.deleteMany({ campaign: campaign });
};

module.exports = {
  createCampaign: {
    type: CampaignsType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      advertiser: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const campaign = await CampaignsModel.create({ ...args });
      await AddCampaignToUser(campaign._id, args.user);
      return campaign;
    },
  },
  editCampaign: {
    type: CampaignsType,
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      advertiser: { type: GraphQLString },
      description: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { campaign } = args;
      delete args.campaign;
      return await CampaignsModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(campaign),
        },
        args,
        { new: true },
      );
    },
  },
  deleteCampaign: {
    type: GraphQLID,
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign }) => {
      const deletedCampaign = await CampaignsModel.findOneAndDelete({
        _id: Types.ObjectId(campaign),
      });
      await CleanByCampaign(deletedCampaign._id || null);
      return deletedCampaign._id || null;
    },
  },
  uploadModel: {
    type: GraphQLBoolean,
    args: {
      model: { type: GraphQLUpload },
    },
    resolve: async (_, { model }) => {
      const { createReadStream, filename } = await model;
      const stream = createReadStream();
      const pathFile = await storeFS({ stream, filename });
      return !!pathFile;
    },
  },
  uploadGaze: {
    type: GraphQLBoolean,
    args: {
      model: { type: GraphQLUpload },
    },
    resolve: async (_, { model }) => {
      const { filename, createReadStream } = await model;
      const stream = createReadStream();
      const pathFile = await storeFS({ stream, filename });
      return !!pathFile;
    },
  },
  uploadAction: {
    type: GraphQLBoolean,
    args: {
      model: { type: GraphQLUpload },
    },
    resolve: async (_, { model }) => {
      const { filename, createReadStream } = await model;
      const stream = createReadStream();
      const pathFile = await storeFS({ stream, filename });
      return !!pathFile;
    },
  },
};
