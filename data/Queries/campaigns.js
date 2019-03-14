const { GraphQLList } = require('graphql');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');

module.exports = {
  campaigns: {
    type: new GraphQLList(CampaignsType),
    resolve: async () => await CampaignsModel.find({}),
  },
};
