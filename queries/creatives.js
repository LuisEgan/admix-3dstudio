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
      $size: String!
      $description: String
      $iab: String
    ) {
      createCreative(creative: $creative) {
        id
        name
      }
    }
  `,
  creativeXML: gql`
    query CreativeXML($creative: ID!) {
      creativeXML(creative: $creative) {
        id
      }
    }
  `,
};
