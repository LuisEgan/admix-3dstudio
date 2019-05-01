import { gql } from 'apollo-boost';

export default {
  createGroup: gql`
    mutation CreateGroup($campaign: ID!, $name: String!, $description: String) {
      createGroup(campaign: $campaign, name: $name, description: $description) {
        id
        state
        name
        description
        campaign {
          id
          name
        }
      }
    }
  `,
  editGroup: gql`
    mutation EditGroup(
      $user: ID!
      $group: ID!
      $name: String
      $state: String
      $campaign: ID
      $description: String
    ) {
      editGroup(
        user: $user
        group: $group
        name: $name
        state: $state
        campaign: $campaign
        description: $description
      ) {
        id
        name
        campaign {
          id
          name
        }
      }
    }
  `,
  deleteGroup: gql`
    mutation DeleteGroup($user: ID!, $group: ID!) {
      deleteGroup(user: $user, group: $group)
    }
  `,
};
