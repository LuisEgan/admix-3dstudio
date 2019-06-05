const { GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const s3Upload = require('../Utils/aws');
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
    description:
      'This mutation helps you to create new creative. You should to provide `GroupID`, `Name` and `Size` arguments to create this creative. Resolve new creative object.',
    args: {
      group: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      size: { type: new GraphQLNonNull(GraphQLString) },
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
    description:
      'This mutation helps you to edit exist creative. You should to provide Creative argument with `Creative ID` that should to be edit. Other arguments are Not Required but should be provided for edit Creative. Resolve object with updated Creative.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      state: { type: GraphQLString },
      size: { type: GraphQLString },
      XMLUrl: { type: GraphQLString },
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
    description:
      'This mutation helps you adding Group to existing Creative. You should to provide `CreativeID`, `UserID` and Array of `GroupsIDs` that should to be added in the Creative. Resolve object with added groups.',
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
    description:
      'This mutation helps you remove Group from existing Creative. You should to provide `CreativeID`, `UserID` and Array of `GroupsIDs` that should to be removed from the Creative. Resolve object without removed groups.',
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
    description:
      'This mutation helps you to delete creative. You should to provide `Creative ID` in arguments to delete creative. Resolve ID of deleted creative.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { creative }) => {
      const { groups, _id } = await CreativesModel.findOneAndUpdate(
        {
          _id: Types.ObjectId(creative),
        },
        { deleted: true },
      );
      await RemoveCreativeFromGroup(_id, groups);
      return _id || null;
    },
  },
  uploadModel: {
    type: CreativesType,
    description:
      'This mutation helps you to upload new `Model` in the creative. Resolve `CreativesType` all info of `Model`, if it will be needed.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      size: { type: GraphQLString },
      scale: { type: GraphQLInt },
      model: { type: GraphQLUpload },
    },
    resolve: async (_, { model, creative, size, scale }) => {
      const { createReadStream, filename } = await model;
      const stream = createReadStream();
      const { ETag, Location, Key } = await s3Upload({ stream, filename });
      return await CreativesModel.findByIdAndUpdate(
        creative,
        { $set: { 'uploads.model': { tag: ETag, url: Location, key: Key }, size, scale } },
        { new: true },
      );
    },
  },
  uploadGaze: {
    type: CreativesType,
    description:
      'This mutation helps you to upload new `Gaze` in the creative. Resolve `CreativesType` all info of `Gaze`, if it will be needed.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      model: { type: GraphQLUpload },
    },
    resolve: async (_, { model, creative }) => {
      const { filename, createReadStream } = await model;
      const stream = createReadStream();
      const { ETag, Location, Key } = await s3Upload({ stream, filename });
      return await CreativesModel.findByIdAndUpdate(
        creative,
        { $set: { 'uploads.gaze': { tag: ETag, url: Location, key: Key } } },
        { new: true },
      );
    },
  },
  uploadAction: {
    type: CreativesType,
    description:
      'This mutation helps you to upload new `Action` in the creative. Resolve `CreativesType` all info of `Action`, if it will be needed.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
      model: { type: GraphQLUpload },
    },
    resolve: async (_, { model, creative }) => {
      const { filename, createReadStream } = await model;
      const stream = createReadStream();
      const { ETag, Location, Key } = await s3Upload({ stream, filename });
      return await CreativesModel.findByIdAndUpdate(
        creative,
        { $set: { 'uploads.action': { tag: ETag, url: Location, key: Key } } },
        { new: true },
      );
    },
  },
};
