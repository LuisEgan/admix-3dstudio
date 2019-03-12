const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

const CampaignsModel = require("../Models/campaigns");
const UsersType = require("./users");

const CampaignsType = new GraphQLObjectType({
  name: "CampaignsType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    state: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: UsersType,
      resolve: async parentValue => {
        const { user } = await CampaignsModel.findById(parentValue).populate(
          "user",
        );
        return user;
      },
    },
  }),
});

module.exports = CampaignsType;
