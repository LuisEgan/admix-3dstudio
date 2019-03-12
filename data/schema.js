const { GraphQLSchema } = require('graphql');
const QueryType = require('./Queries');
const MutationType = require('./Mutations');

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
