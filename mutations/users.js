import { gql } from 'apollo-boost';

export default {
  loginUser: gql`
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        accessToken
        name
        email
        id
      }
    }
  `,

  createUser: gql`
    mutation CreateUser($name: String!, $email: String!, $password: String!, $company: String) {
      createUser(name: $name, email: $email, password: $password, company: $company) {
        id
      }
    }
  `,
};
