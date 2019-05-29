const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = require('graphql');

const CreativesModel = require('../Models/creatives');

const FBXFileType = name =>
  new GraphQLObjectType({
    name: `${name}Type`,
    fields: () => ({
      id: { type: GraphQLID },
      tag: { type: GraphQLString },
      url: { type: GraphQLString },
      key: { type: GraphQLString },
    }),
  });

const UploadType = new GraphQLObjectType({
  name: 'UploadsType',
  fields: () => ({
    model: { type: FBXFileType('Model') },
    gaze: { type: FBXFileType('Gaze') },
    action: { type: FBXFileType('Action') },
  }),
});

module.exports = new GraphQLObjectType({
  name: 'CreativesType',
  fields: () => ({
    id: { type: GraphQLID },
    behaviorURL: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
    description: { type: GraphQLString },
    format: { type: GraphQLString },
    IAB: { type: GraphQLString },
    name: { type: GraphQLString },
    scale: { type: GraphQLInt },
    size: { type: GraphQLString },
    state: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    XRaidURL: { type: GraphQLString },
    group: {
      type: require('./groups'),
      resolve: async parentValue => await CreativesModel.getGroup(parentValue._id),
    },
    uploads: {
      type: UploadType,
    },
  }),
});
