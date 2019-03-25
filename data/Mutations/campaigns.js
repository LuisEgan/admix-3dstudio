const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');

module.exports = {
  createCampaign: {
    type: CampaignsType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      advertiser: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    },
    resolve: async (parentValue, args) =>
      await CampaignsModel.create({ ...args }),
  },
};
