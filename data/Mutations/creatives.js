const {
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');
const { Types } = require('mongoose');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');
const GroupsModel = require('../Models/groups');

const AddCreativeToGroups = async (creative, groups) =>
  await GroupsModel.updateMany(
    {
      _id: { $in: groups },
    },
    {
      $addToSet: { creatives: creative },
    },
  );

const RemoveCreativeFromGroups = async (creative, groups) =>
  await GroupsModel.updateMany(
    {
      _id: { $in: groups },
    },
    {
      $pull: { creatives: creative },
    },
  );

module.exports = {
  createCreative: {
    type: CreativesType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      groups: { type: new GraphQLNonNull(GraphQLID) },
      size: { type: new GraphQLNonNull(GraphQLInt) },
      description: { type: GraphQLString },
      IAB: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => {
      const creative = await CreativesModel.create({ ...args });
      await AddCreativeToGroups(creative._id, creative.groups);
      return creative;
    },
  },
  editCreative: {
    type: CreativesType,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      size: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => {
      const { creative, user } = args;
      delete args.user;
      delete args.creative;
      return await CreativesModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(creative),
          user: Types.ObjectId(user),
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
      await AddCreativeToGroups(newCreative._id, newCreative.groups);
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
      await RemoveCreativeFromGroups(newCreative._id, groups);
      return newCreative;
    },
  },
  deleteCreative: {
    type: GraphQLID,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      user: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { creative, user }) => {
      const { groups, _id } = await CreativesModel.findOneAndDelete({
        _id: Types.ObjectId(creative),
        user: Types.ObjectId(user),
      });
      await RemoveCreativeFromGroups(_id, groups);
      return _id;
    },
  },
};
