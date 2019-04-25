const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

module.exports = {
  creativeById: {
    type: CreativesType,
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { creative }) => await CreativesModel.findById(creative, { deleted: 0 }),
  },
  creatives: {
    type: new GraphQLList(CreativesType),
    resolve: async () => await CreativesModel.find({ deleted: false }, { deleted: 0 }),
  },
};
