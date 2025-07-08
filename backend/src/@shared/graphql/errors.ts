import { Field, ObjectType } from '@nestjs/graphql'
import { ZodError, z } from 'zod'

@ObjectType()
export class ZodValidationError {
  @Field(() => [String])
  path: string[]

  @Field()
  message: string

  @Field()
  code: string

  @Field(() => Boolean, { nullable: true })
  fatal?: boolean

  static fromZodError(error: ZodError): ZodValidationError[] {
    return error.issues.map((issue) => ({
      path: issue.path.map((path) => path.toString()),
      message: issue.message,
      code: issue.code,
      fatal: issue.fatal,
    }))
  }

  static fromData(data: { path: string[]; message: string; code: string; fatal?: boolean }): ZodValidationError {
    return {
      path: data.path,
      message: data.message,
      code: data.code,
      fatal: data.fatal,
    }
  }

  static validate<T>(schema: z.Schema<T>, data: T): { errors: ZodValidationError[] } | T {
    try {
      const parsed = schema.parse(data)
      return parsed
    } catch (error) {
      if (error instanceof ZodError) {
        return { errors: ZodValidationError.fromZodError(error) }
      }
      throw error
    }
  }
}
