const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');

const CampaignModel = require('../Models/campaigns');

module.exports = new GraphQLObjectType({
  name: 'CampaignsType',
  fields: () => ({
    id: { type: GraphQLID },
    state: { type: GraphQLString },
    name: { type: GraphQLString },
    advertiser: { type: GraphQLString },
    description: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: require('./users'),
      resolve: async parentValue => await CampaignModel.getUser(parentValue._id),
    },
    groups: {
      type: new GraphQLList(require('./groups')),
      resolve: async parentValue => await CampaignModel.getGroups(parentValue._id),
    },
  }),
});
