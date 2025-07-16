import { Injectable } from '@nestjs/common'
import { ZodValidationError } from 'src/@shared/graphql/errors'
import { ExecutionDTOType, MethodType } from 'src/@shared/types/auth'
import { checkPermission } from 'src/@shared/utils'
import { PrismaService } from 'src/infra/database/prisma.service'
import { CreateDTO, DeleteDTO, EntityResponse, GetDTO, UpdateDTO } from './entities/entity'
import { moduleMetadata } from './moduleMetadata'

@Injectable()
export class Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: ExecutionDTOType<any, any>): Promise<EntityResponse> {
   
    let DTO = data
    for (const rule of Object.values(this[data.method].rules)) {
      console.log('Executando regra:', rule
      );
      DTO = await (rule as any)(DTO)
      console.log('Resultado da regra:', DTO);
      if (DTO.error) {
        console.log('Erro retornado pela regra:', DTO.error);
        return DTO.error
      }
    }

    const result = await this[data.method].execution(DTO)
console.log('Resultado da execução:', result);
    return result
  }

  create: MethodType<ExecutionDTOType<CreateDTO, 'create'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        // Check permission for creating pokemon
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-criar-pokemon'] })).permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(CreateDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
      uniqueName: async (data) => {
        const result = await this.prisma[moduleMetadata.tb].findFirst({
          where: {
            name: data.datap.name,
          },
        })
        if (result) {
          data.error = {
            error: {
              errors: [
                {
                  message: 'Nome já existe',
                  path: ['name'],
                  code: 'custom',
                },
              ],
            },
          }
        }
        return data
      },
    },
    execution: async (data: ExecutionDTOType<CreateDTO, 'create'>) => {
      const result = await this.prisma[moduleMetadata.tb].create({
        data: data.datap as any,
      })

      return {
        data: {
          count: 1,
          items: [result],
        },
      }
    },
  }

  get: MethodType<ExecutionDTOType<GetDTO, 'get'>, EntityResponse> = {
    rules: {
    perm: async (data) => {
        // Check permission for reading pokemon
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-ler-pokemon'] })).permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        console.log("permissão checada no GetDTO")
        return data
      }, 
      validateDTOData: async (data) => {
        console.log("validateDTOData foi chamado")
        const validatedData = ZodValidationError.validate(GetDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
         console.log("validatedData é:", validatedData)
        return data
      },
    },
    execution: async (data: ExecutionDTOType<GetDTO, 'get'>) => {
      const where = {}
      const take = data.datap.take || 10
      const skip = data.datap.skip || 0

      const [items, count] = await Promise.all([
        this.prisma[moduleMetadata.tb].findMany({
          where,
          take,
          skip,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma[moduleMetadata.tb].count({ where }),
      ])

      return {
        data: {
          count,
          items,
        },
      }
    },
  }

  update: MethodType<ExecutionDTOType<UpdateDTO, 'update'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        // Check permission for updating pokemon
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-atualizar-pokemon'] }))
            .permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(UpdateDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
      checkExists: async (data) => {
        const result = await this.prisma[moduleMetadata.tb].findUnique({
          where: { id: data.datap.id },
        })
        if (!result) {
          data.error = { error: { notFound: 'Pokemon não encontrado' } }
        }
        return data
      },
    },
    execution: async (data: ExecutionDTOType<UpdateDTO, 'update'>) => {
      const { id, ...updateData } = data.datap
      const result = await this.prisma[moduleMetadata.tb].update({
        where: { id },
        data: updateData as any,
      })

      return {
        data: {
          count: 1,
          items: [result],
        },
      }
    },
  }

  delete: MethodType<ExecutionDTOType<DeleteDTO, 'delete'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        // Check permission for deleting pokemon
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-deletar-pokemon'] }))
            .permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(DeleteDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
      checkExists: async (data) => {
        const result = await this.prisma[moduleMetadata.tb].findUnique({
          where: { id: data.datap.id },
        })
        if (!result) {
          data.error = { error: { notFound: 'Pokemon não encontrado' } }
        }
        return data
      },
    },
    execution: async (data: ExecutionDTOType<DeleteDTO, 'delete'>) => {
      const result = await this.prisma[moduleMetadata.tb].delete({
        where: { id: data.datap.id },
      })

      return {
        data: {
          count: 1,
          items: [result],
        },
      }
    },
  }
}
