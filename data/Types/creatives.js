const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');

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
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    XRaidURL: { type: GraphQLString },
    behaviorURL: { type: GraphQLString },
    format: { type: GraphQLString },
    state: { type: GraphQLString },
    size: { type: GraphQLString },
    IAB: { type: GraphQLString },
    XMLUrl: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    group: {
      type: require('./groups'),
      resolve: async parentValue => await CreativesModel.getGroup(parentValue._id),
    },
    uploads: {
      type: UploadType,
    },
  }),
});
