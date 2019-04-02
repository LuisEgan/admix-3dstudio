const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UsersType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
    accessGroups: { type: GraphQLString },
  }),
});
