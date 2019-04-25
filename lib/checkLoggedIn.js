import { gql } from 'apollo-boost';

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query {
          user {
            id
            name
          }
        }
      `,
    })
    .then(({ data }) => {
      return { loggedInUser: data };
    })
    .catch(() => {
      return { loggedInUser: {} };
    });
