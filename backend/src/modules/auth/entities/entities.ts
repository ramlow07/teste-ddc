import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { z } from 'zod';
import { MainResponse } from '../@shared/graphql/types';

@ObjectType('AuthResponse')
export class AuthResponse extends MainResponse {
  @Field(() => String, { nullable: true })
  token?: string;
}

@InputType('LoginDTO')
export class LoginDTO {
  @Field(() => String)
  email: string;
  static emailZod = z.string().email();

  @Field(() => String)
  password: string;
  static passwordZod = z.string().min(6);

  static zodSchema = z.object({
    email: LoginDTO.emailZod,
    password: LoginDTO.passwordZod,
  });
}