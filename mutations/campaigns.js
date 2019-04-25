import { gql } from 'apollo-boost';

export const CAMPAIGNS_FRAGMENT = gql`
  fragment CampaignsFragment on CampaignsType {
    id
    name
    state
    startDate
    endDate
    createdAt
    updatedAt
    user {
      id
      name
      company
      email
      accessGroups
    }
  }
`;

export default {
  createCampaign: gql`
    mutation CreateCampaing($user: ID!, $name: String!, $advertiser: String!) {
      createCampaign(user: $user, name: $name, advertiser: $advertiser) {
        ...CampaignsFragment
      }
    }
    ${CAMPAIGNS_FRAGMENT}
  `,
  editCampaign: gql`
    mutation EditCampaing(
      $user: ID!
      $campaign: ID!
      $name: String
      $state: String
      $advertiser: String
      $description: String
      $startDate: String
      $endDate: String
    ) {
      editCampaign(
        user: $user
        campaign: $campaign
        name: $name
        state: $state
        advertiser: $advertiser
        description: $description
        startDate: $startDate
        endDate: $endDate
      ) {
        ...CampaignsFragment
      }
    }
    ${CAMPAIGNS_FRAGMENT}
  `,
  deleteCampaign: gql`
    mutation DeleteCampaing($user: ID!, $campaign: ID!) {
      deleteCampaign(campaign: $campaign, user: $user)
    }
  `,
};
