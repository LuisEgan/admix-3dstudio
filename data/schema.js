const { GraphQLSchema } = require('graphql');
const QueryType = require('./Queries');
const MutationType = require('./Mutations');
const SubscriptionType = require('./Subscriptions');

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
});
