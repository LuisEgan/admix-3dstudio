const { GraphQLList, GraphQLID } = require('graphql');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

module.exports = {
  creativeById: {
    type: CreativesType,
    args: {
      creative: { type: GraphQLID },
    },
    resolve: async (_, { creative }) => await CreativesModel.findById(creative),
  },
  creatives: {
    type: new GraphQLList(CreativesType),
    resolve: async () => await CreativesModel.find({}),
  },
};
