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
  groupsByCampaign: gql`
    query GetGroupsByCampaign($campaign: ID!) {
      groupsByCampaign(campaign: $campaign) {
        id
        state
        name
        description
        creatives {
          id
          name
        }
      }
    }
  `,
};
