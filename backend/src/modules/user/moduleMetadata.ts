import { Prisma, User } from '@prisma/client'

export type moduleMetadataType = {
  name: 'User'
  tb: 'user'
}

export type tableType = User
export type createDTODBType = Prisma.UserCreateInput
export type updateDTODBType = Prisma.UserUpdateInput
export type whereInputType = Prisma.UserWhereInput

export const moduleMetadata: moduleMetadataType = {
  name: 'User',
  tb: 'user',
}

export { MainEntity as UserEntity } from './entities/entity'
