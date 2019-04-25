const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

module.exports = {
  creativeById: {
    type: CreativesType,
    description: 'Get creative by provided ID. Required argument ID. Return Creative object.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { creative }) => await CreativesModel.findById(creative),
  },
  creatives: {
    type: new GraphQLList(CreativesType),
    description: 'Get all creative of the app. No required arguments. Return array of creative.',
    resolve: async () => await CreativesModel.find({}),
  },
};
