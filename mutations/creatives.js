import { gql } from 'apollo-boost';

export default {
  createCreative: gql`
    mutation CreateCreative($user: ID!, $name: String!, $size: Int!, $groups: ID!) {
      createCreative(user: $user, size: $size, name: $name, groups: $groups) {
        id
        name
        sourceURL
        thumbURL
        format
        state
        size
        IAB
        createdAt
        updatedAt
        user {
          id
          name
          company
          email
          accessGroups
        }
        groups {
          id
          name
          state
          description
          createdAt
          updatedAt
          campaign {
            id
            name
            state
            startDate
            endDate
            createdAt
            updatedAt
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
