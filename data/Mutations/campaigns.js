const { GraphQLString, GraphQLID, GraphQLBoolean, GraphQLNonNull } = require('graphql');
const { Types } = require('mongoose');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');
const GroupsModel = require('../Models/groups');
const CreativesModel = require('../Models/creatives');
const UsersModel = require('../Models/users');

const AddCampaignToUser = async (campaign, user) =>
  await UsersModel.findByIdAndUpdate(user, {
    $push: { campaigns: campaign },
  });

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
    description:
      'This mutation helps you to create new campaign. You should to provide `UserID`, `Name` and `Advertiser` arguments to create this campaign. Resolve new campaign object.',
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
    description:
      'This mutation helps you to edit exist campaign. You should to provide Campaign argument with `Campaign ID` that should to be edit. Other arguments are Not Required but should be provided for edit Campaign. Resolve object with updated Campaign.',
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
    description:
      'This mutation helps you to delete campaign. You should to provide `Campaign ID` in arguments to delete campaign. Resolve ID of deleted campaign.',
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
};
