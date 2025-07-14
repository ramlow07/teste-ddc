import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { z } from 'zod';
import { MainResponse } from '../../../@shared/graphql/types';

@ObjectType('AuthResponse')
export class AuthResponse extends MainResponse {
  @Field(() => String, { nullable: true })
  token?: string;
}


@InputType('SignupDTO')
export class SignupDTO {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  static zodSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(6).nonempty(),
    name: z.string().min(1).nonempty(),
  });
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