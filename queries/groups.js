import { gql } from 'apollo-boost';

export default {
  groups: gql`
    query GetAllGroups {
      groups {
        id
        name
      }
    }
  `,
  groupById: gql`
    query GetGroupById($group: ID!) {
      groupById(group: $group) {
        id
        name
      }
    }
  `,
};
