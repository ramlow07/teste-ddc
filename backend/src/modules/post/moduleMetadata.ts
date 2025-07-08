import { Post, Prisma } from '@prisma/client'

export type moduleMetadataType = {
  name: 'Post'
  tb: 'post'
}

export type tableType = Post
export type createDTODBType = Prisma.PostCreateInput
export type updateDTODBType = Prisma.PostUpdateInput
export type whereInputType = Prisma.PostWhereInput

export const moduleMetadata: moduleMetadataType = {
  name: 'Post',
  tb: 'post',
}

export { MainEntity as PostEntity } from './entities/entity'
