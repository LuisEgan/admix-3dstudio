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
    mutation EditCreative($creative: ID!, $name: String, $state: String, $size: String) {
      editCreative(creative: $creative, name: $name, state: $state, size: $size) {
        id
        name
        size
        group {
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

  uploadModel: gql`
    mutation UploadModel($creative: ID!, $size: String, $model: Upload) {
      uploadModel(creative: $creative, size: $size, model: $model) {
        id
        name
      }
    }
  `,
  uploadGaze: gql`
    mutation UploadGaze($creative: ID!, $model: Upload) {
      uploadModel(creative: $creative, model: $model) {
        id
        name
      }
    }
  `,
  uploadAction: gql`
    mutation UploadAction($creative: ID!, $model: Upload) {
      uploadModel(creative: $creative, model: $model) {
        id
        name
      }
    }
  `,
};
