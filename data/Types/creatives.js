const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');

const CreativesModel = require('../Models/creatives');

const FBXFileType = name =>
  new GraphQLObjectType({
    name: `${name}Type`,
    fields: () => ({
      tag: { type: GraphQLString },
      url: { type: GraphQLString },
      key: { type: GraphQLString },
    }),
  });

const FBXFileTypeModel = new GraphQLObjectType({
  name: 'ModelType',
  fields: () => ({
    tag: { type: GraphQLString },
    url: { type: GraphQLString },
    key: { type: GraphQLString },
    size: { type: GraphQLString },
  }),
});

const UploadType = new GraphQLObjectType({
  name: 'UploadsType',
  fields: () => ({
    id: { type: GraphQLID },
    model: { type: FBXFileTypeModel },
    gaze: { type: FBXFileType('Gaze') },
    action: { type: FBXFileType('Action') },
  }),
});

module.exports = new GraphQLObjectType({
  name: 'CreativesType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    sourceURL: { type: GraphQLString },
    thumbURL: { type: GraphQLString },
    format: { type: GraphQLString },
    state: { type: GraphQLString },
    size: { type: GraphQLString },
    IAB: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    group: {
      type: require('./groups'),
      resolve: async parentValue => await CreativesModel.getGroup(parentValue._id),
    },
    uploads: {
      type: new GraphQLList(UploadType),
    },
  }),
});
