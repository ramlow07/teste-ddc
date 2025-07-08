import { Category, Prisma } from '@prisma/client'

export type moduleMetadataType = {
  name: 'Category'
  tb: 'category'
}

export type tableType = Category
export type createDTODBType = Prisma.CategoryCreateInput
export type updateDTODBType = Prisma.CategoryUpdateInput
export type whereInputType = Prisma.CategoryWhereInput

export const moduleMetadata: moduleMetadataType = {
  name: 'Category',
  tb: 'category',
}

export { MainEntity as CategoryEntity } from './entities/entity'
