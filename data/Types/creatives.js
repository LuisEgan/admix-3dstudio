const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const CreativesModel = require('../Models/creatives');

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
  }),
});
