const { GraphQLList } = require('graphql');
const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

module.exports = {
  creatives: {
    type: new GraphQLList(CreativesType),
    resolve: async () => await CreativesModel.find({}),
  },
};
