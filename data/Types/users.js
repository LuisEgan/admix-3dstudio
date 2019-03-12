const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

const UsersType = new GraphQLObjectType({
  name: "UsersType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
    accessGroups: { type: GraphQLString },
  }),
});

module.exports = UsersType;
