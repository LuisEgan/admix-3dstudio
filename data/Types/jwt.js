const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const JWTType = new GraphQLObjectType({
  name: 'JWTType',
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = JWTType;
