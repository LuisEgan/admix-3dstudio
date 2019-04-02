const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UsersType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: GraphQLString },
    accessGroups: { type: GraphQLString }
  })
});
