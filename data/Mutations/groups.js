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
    description:
      'This mutation helps you to create new group. You should to provide `CampaignID` and `Name` arguments to create group. Resolve new group object.',
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
    description:
      'This mutation helps you to edit exist group. You should to provide group argument with `Group ID` that should to be edit. Other arguments are Not Required but should be provided for editing group. Resolve object with updated group.',
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
    description:
      'This mutation helps you to delete group. You should to provide `Group ID` in arguments to delete group. Resolve ID of deleted group.',
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
