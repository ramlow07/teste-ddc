import { Pokemon, Prisma } from '@prisma/client'

export type moduleMetadataType = {
  name: 'Pokemon'
  tb: 'pokemon'
}

export type tableType = Pokemon
export type createDTODBType = Prisma.PokemonCreateInput
export type updateDTODBType = Prisma.PokemonUpdateInput
export type whereInputType = Prisma.PokemonWhereInput

export const moduleMetadata: moduleMetadataType = {
  name: 'Pokemon',
  tb: 'pokemon',
}

export { MainEntity as PokemonEntity } from './entities/entity'
