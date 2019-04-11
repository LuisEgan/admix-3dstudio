const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');

module.exports = {
  campaignById: {
    type: CampaignsType,
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign }) => await CampaignsModel.findById(campaign),
  },
  campaigns: {
    type: new GraphQLList(CampaignsType),
    resolve: async () => await CampaignsModel.find({}),
  },
};
