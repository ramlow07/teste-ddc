import { SetMetadata } from '@nestjs/common/decorators'

export const Role = (...role: string[]) => SetMetadata('role', role)
