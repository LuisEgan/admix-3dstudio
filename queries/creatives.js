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
};
