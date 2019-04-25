const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { Types } = require('mongoose');
const { GroupsType } = require('../Types');
const GroupsModel = require('../Models/groups');
const CreativeModel = require('../Models/creatives');
const CampaignModel = require('../Models/campaigns');

const AddGroupToCampaign = async (group, campaign) => {
  return await CampaignModel.findByIdAndUpdate(campaign, {
    $push: { groups: group },
  });
};

const CleanCreativeByGroup = async (group, creative) =>
  await CreativeModel.updateMany(
    {
      _id: {
        $in: creative,
      },
    },
    {
      $pull: {
        groups: group,
      },
    },
  );

module.exports = {
  createGroup: {
    type: GroupsType,
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const group = await GroupsModel.create({ ...args });
      await AddGroupToCampaign(group._id, args.campaign);
      return group;
    },
  },
  editGroup: {
    type: GroupsType,
    args: {
      group: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      campaign: { type: GraphQLID },
      description: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { group } = args;
      delete args.group;
      return await GroupsModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(group),
        },
        args,
        {
          new: true,
        },
      );
    },
  },
  deleteGroup: {
    type: GraphQLID,
    args: {
      group: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { group }) => {
      const { creatives, _id } = await GroupsModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(group),
        },
        { deleted: true },
      );
      await CleanCreativeByGroup(_id, creatives);
      return _id || null;
    },
  },
};
