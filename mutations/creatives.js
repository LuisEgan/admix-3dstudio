import { gql } from 'apollo-boost';

export default {
  createCreative: gql`
    mutation CreateCreative(
      $group: ID!
      $name: String!
      $size: String!
      $description: String
      $iab: String
    ) {
      createCreative(
        group: $group
        name: $name
        size: $size
        description: $description
        IAB: $iab
      ) {
        id
        name
        size
        description
        IAB
        group {
          id
          name
          campaign {
            id
            name
          }
        }
      }
    }
  `,
  editCreative: gql`
    mutation EditCreative(
      $user: ID!
      $creative: ID!
      $name: String
      $state: String
      $size: String
    ) {
      editCreative(user: $user, creative: $creative, name: $name, state: $state, size: $size) {
        id
        name
        groups {
          id
          name
        }
      }
    }
  `,
  addGroupsToCreative: gql`
    mutation AddGroupsToCreative($user: ID!, $creative: ID!, $groups: [ID!]) {
      addGroupsToCreative(user: $user, creative: $creative, groups: $groups) {
        id
        name
        groups {
          id
          name
        }
      }
    }
  `,
  removeGroupsFromCreative: gql`
    mutation RemoveGroupsFromCreative($user: ID!, $creative: ID!, $groups: [ID!]) {
      removeGroupsFromCreative(user: $user, creative: $creative, groups: $groups) {
        id
        name
        groups {
          id
          name
        }
      }
    }
  `,
  deleteCreative: gql`
    mutation DeleteCreative($user: ID!, $creative: ID!) {
      deleteCreative(creative: $creative, user: $user)
    }
  `,
};
