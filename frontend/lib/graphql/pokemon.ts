import { gql } from "graphql-request";

export const GET_POKEMONS_QUERY = gql`
  query GetPokemon($data: GetPokemonsDTO!) {
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
