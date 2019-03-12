const { GraphQLObjectType } = require('graphql');
const CampaignsQueries = require('./campaigns');

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...CampaignsQueries,
  }),
});
