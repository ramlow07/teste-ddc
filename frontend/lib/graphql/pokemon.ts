import { GraphQLClient, gql } from "graphql-request";

const endpoint = "http://localhost:3001/graphql"; // url apontando pro backend
export const client = new GraphQLClient(endpoint);

export const GET_POKEMONS_QUERY = gql`
  query getPokemons($data: GetPokemonsDTO!) {
    getPokemons(data: $data) {
      data {
        count
        items {
          id
          name
          type
          ability
          image
          createdAt
        }
      }
      error {
        errors {
          message
        }
      }
    }
  }
`;

export const DELETE_POKEMON_MUTATION = gql`
  mutation DeletePokemon($data: DeletePokemonDTO!) {
    deletePokemon(data: $data) {
      data {
        count
        items {
          id
          name
        }
      }
      error {
        errors {
          message
        }
      }
    }
  }
`;
