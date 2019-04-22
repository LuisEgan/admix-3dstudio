import { gql } from 'apollo-boost';

export default {
  creatives: gql`
    query GetAllCreatives {
      creatives {
        id
        name
      }
    }
  `,
  creativeById: gql`
    query GetCreativesById($creative: ID!) {
      creativeById(creative: $creative) {
        id
        name
      }
    }
  `,
  createCreative: gql`
    query CreateCreative(
      $group: ID!
      $name: String!
      $size: Int!
      $description: String
      $iab: String
    ) {
      createCreative(creative: $creative) {
        id
        name
      }
    }
  `,
};
