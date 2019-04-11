const { GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const { Types } = require('mongoose');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');
const GroupsModel = require('../Models/groups');

const AddCreativeToGroup = async (creative, group) => {
  return await GroupsModel.findByIdAndUpdate(group, {
    $push: { creatives: creative },
  });
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

module.exports = {
  createCreative: {
    type: CreativesType,
    args: {
      group: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      size: { type: new GraphQLNonNull(GraphQLInt) },
      description: { type: GraphQLString },
      IAB: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const creative = await CreativesModel.create({ ...args });
      await AddCreativeToGroup(creative._id, args.group);
      return creative;
    },
  },
  editCreative: {
    type: CreativesType,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      size: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { creative } = args;
      delete args.creative;
      return await CreativesModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(creative),
        },
        args,
        {
          new: true,
        },
      );
    },
  },
  addGroupsToCreative: {
    type: CreativesType,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      user: { type: new GraphQLNonNull(GraphQLID) },
      groups: { type: new GraphQLList(GraphQLID) },
    },
    resolve: async (_, { creative, user, groups }) => {
      const newCreative = await CreativesModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(creative),
          user: Types.ObjectId(user),
        },
        {
          $addToSet: { groups: { $each: groups } },
        },
        { new: true },
      );
      await AddCreativeToGroup(newCreative._id, newCreative.groups);
      return newCreative;
    },
  },
  removeGroupsFromCreative: {
    type: CreativesType,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      user: { type: new GraphQLNonNull(GraphQLID) },
      groups: { type: new GraphQLList(GraphQLID) },
    },
    resolve: async (_, { creative, user, groups }) => {
      const newCreative = await CreativesModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(creative),
          user: Types.ObjectId(user),
        },
        {
          $pull: { groups: { $in: groups } },
        },
        { new: true },
      );
      await RemoveCreativeFromGroup(newCreative._id, groups);
      return newCreative;
    },
  },
  deleteCreative: {
    type: GraphQLID,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { creative }) => {
      const { groups, _id } = await CreativesModel.findOneAndDelete({
        _id: Types.ObjectId(creative),
      });
      await RemoveCreativeFromGroup(_id, groups);
      return _id || null;
    },
  },
};
