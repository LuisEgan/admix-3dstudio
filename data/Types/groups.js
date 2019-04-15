const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');

const GroupModel = require('../Models/groups');

module.exports = new GraphQLObjectType({
  name: 'GroupsType',
  fields: {
    id: { type: GraphQLID },
    state: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    campaign: {
      type: require('./campaigns'),
      resolve: async parentValue => await GroupModel.getCampaign(parentValue._id),
    },
    creatives: {
      type: new GraphQLList(require('./creatives')),
      resolve: async parentValue => await GroupModel.getCreatives(parentValue._id),
    },
  },
});
