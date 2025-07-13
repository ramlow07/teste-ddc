import { GraphQLClient, gql } from "graphql-request";

const endpoint = "http://localhost:3001/graphql"; // url apontando pro backend

export const client = new GraphQLClient(endpoint);

export const SIGNUP_MUTATION = gql`
  mutation Signup($data: SignupDTO!) {
    signup(data: $data) {
      token
      error {
        errors {
          message
          path
          code
        }
      }
    }
  }
`;
