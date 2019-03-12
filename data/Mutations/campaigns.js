const { GraphQLString, GraphQLID } = require("graphql");
const { CampaignsType } = require("../Types");
const CampaignsModel = require("../Models/campaigns");

module.exports = {
  createCampaign: {
    type: CampaignsType,
    args: {
      userId: { type: GraphQLID },
      name: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
      startDate: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => {
      const newCampaign = await CampaignsModel.create({ ...args });
      return newCampaign;
    },
  },
};
