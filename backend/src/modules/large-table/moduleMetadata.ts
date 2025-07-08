import { LargeTable, Prisma } from '@prisma/client'

export type moduleMetadataType = {
  name: 'LargeTable'
  tb: 'largeTable'
}

export type tableType = LargeTable
export type createDTODBType = Prisma.LargeTableCreateInput
export type updateDTODBType = Prisma.LargeTableUpdateInput
export type whereInputType = Prisma.LargeTableWhereInput

export const moduleMetadata: moduleMetadataType = {
  name: 'LargeTable',
  tb: 'largeTable',
}

export { MainEntity as LargeTableEntity } from './entities/entity'
