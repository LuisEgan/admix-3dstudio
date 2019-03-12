const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = require("graphql");

const CreativesModel = require("../Models/creatives");
const UsersType = require("./users");
const GroupsType = require("./groups");

const CreativesType = new GraphQLObjectType({
  name: "CreativesType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    sourceURL: { type: GraphQLString },
    thumbURL: { type: GraphQLString },
    format: { type: GraphQLString },
    state: { type: GraphQLString },
    size: { type: GraphQLString },
    IAB: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: UsersType,
      resolve: async parentValue => {
        const { user } = await CreativesModel.findById(parentValue).populate(
          "user",
        );
        return user;
      },
    },
    groups: {
      type: new GraphQLList(GroupsType),
      resolve: async parentValue => {
        const { groups } = await CreativesModel.findById(parentValue).populate(
          "groups",
        );
        return groups;
      },
    },
  }),
});

module.exports = CreativesType;
