const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");

const GroupsModel = require("../Models/groups");
const UsersType = require("./users");
const CampaignsType = require("./campaigns");
const CreativesType = require("./creatives");

const GroupsType = new GraphQLObjectType({
  name: "GroupsType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    state: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: UsersType,
      resolve: async parentValue => {
        const { user } = await GroupsModel.findById(parentValue).populate(
          "user",
        );
        return user;
      },
    },
    campaign: {
      type: CampaignsType,
      resolve: async parentValue => {
        const { campaign } = await GroupsModel.findById(parentValue).populate(
          "campaign",
        );
        return campaign;
      },
    },
    creatives: {
      type: new GraphQLList(CreativesType),
      resolve: async parentValue => {
        const { creatives } = await GroupsModel.findById(parentValue).populate(
          "creatives",
        );
        return creatives;
      },
    },
  }),
});

module.exports = GroupsType;
