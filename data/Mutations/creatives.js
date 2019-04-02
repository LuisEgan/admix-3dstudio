const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

module.exports = {
  createCreative: {
    type: CreativesType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      groups: { type: new GraphQLNonNull(GraphQLID) },
      size: { type: new GraphQLNonNull(GraphQLInt) },
      description: { type: GraphQLString },
      IAB: { type: GraphQLString },
    },
    resolve: async (parentValue, args) =>
      await CreativesModel.create({ ...args }),
  },
};
