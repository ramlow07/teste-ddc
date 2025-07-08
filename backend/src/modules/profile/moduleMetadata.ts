import { Prisma, Profile } from '@prisma/client'

export type moduleMetadataType = {
  name: 'Profile'
  tb: 'profile'
}

export type tableType = Profile
export type createDTODBType = Prisma.ProfileCreateInput
export type updateDTODBType = Prisma.ProfileUpdateInput
export type whereInputType = Prisma.ProfileWhereInput

export const moduleMetadata: moduleMetadataType = {
  name: 'Profile',
  tb: 'profile',
}

export { MainEntity as ProfileEntity } from './entities/entity'
