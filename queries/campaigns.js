import { gql } from 'apollo-boost';

export default {
  campaigns: gql`
    query GetAllCampaigns {
      campaigns {
        id
        name
      }
    }
  `,
  campaignById: gql`
    query GetCampaignsById($campaign: ID!) {
      campaignById(campaign: $campaign) {
        id
        name
      }
    }
  `,
};
