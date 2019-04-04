const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { Types } = require('mongoose');
const { GroupsType } = require('../Types');
const GroupsModel = require('../Models/groups');
const CreativeModel = require('../Models/creatives');

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
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      campaign: { type: new GraphQLNonNull(GraphQLID) },
      description: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => await GroupsModel.create({ ...args }),
  },
  editGroup: {
    type: GroupsType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      group: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      campaign: { type: GraphQLID },
      description: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => {
      const { group, user } = args;
      delete args.user;
      delete args.group;
      return await GroupsModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(group),
          user: Types.ObjectId(user),
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
      user: { type: new GraphQLNonNull(GraphQLID) },
      group: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { group, user }) => {
      const { creatives, _id } = await GroupsModel.findOneAndDelete({
        _id: Types.ObjectId(group),
        user: Types.ObjectId(user),
      });
      await CleanCreativeByGroup(_id, creatives);
      return _id;
    },
  },
};
