const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { Types } = require('mongoose');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');
const GroupsModel = require('../Models/groups');
const CreativesModel = require('../Models/creatives');

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
    resolve: async (parentValue, args) =>
      await CampaignsModel.create({ ...args }),
  },
  editCampaign: {
    type: CampaignsType,
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      advertiser: { type: GraphQLString },
      description: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => {
      const { campaign, user } = args;
      delete args.user;
      delete args.campaign;
      return await CampaignsModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(campaign),
          user: Types.ObjectId(user),
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
      user: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign, user }) => {
      const deletedCampaign = await CampaignsModel.findOneAndDelete({
        _id: Types.ObjectId(campaign),
        user: Types.ObjectId(user),
      });
      await CleanByCampaign(deletedCampaign._id || null);
      return deletedCampaign._id || null;
    },
  },
};
