import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infra/database/prisma.service';
import { ZodValidationError } from '../../@shared/graphql/errors';
import { ExecutionDTOType } from '../../@shared/types/auth';
import { AuthResponse, LoginDTO, SignupDTO } from './entities/entities';



@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

async signup(data: ExecutionDTOType<SignupDTO, 'signup'>): Promise<AuthResponse> {
  const validatedData = ZodValidationError.validate(SignupDTO.zodSchema, data.datap);
  if ('errors' in validatedData) {
    return { error: { errors: validatedData.errors } };
  }
  data.datap = validatedData as SignupDTO;

  const existingUser = await this.prisma.user.findUnique({
    where: { email: data.datap.email },
  });

  if (existingUser) {
    return {
      error: {
        errors: [{ message: 'E-mail já está em uso', path: ['email'], code: 'custom' }],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(data.datap.password, 10);

  const newUser = await this.prisma.user.create({
    data: {
      email: data.datap.email,
      password: hashedPassword,
      name: data.datap.name || '',
    },
  });

  const payload = { sub: newUser.id, email: newUser.email };
  const token = this.jwtService.sign(payload);

  console.log('Usuário criado com sucesso');
  return {
    token,
  };


}

  async login(data: ExecutionDTOType<LoginDTO, 'login'>): Promise<AuthResponse> {
    // Validação do DTO
    const validatedData = ZodValidationError.validate(LoginDTO.zodSchema, data.datap);
    if ('errors' in validatedData) {
      return { error: { errors: validatedData.errors } };
    }
    data.datap = validatedData as LoginDTO;

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { email: data.datap.email },
    });

    if (!user) {
      return {
        error: {
          errors: [{ message: 'Usuário não encontrado', path: ['email'], code: 'custom' }],
        },
      };
    }

    // Validar senha
    const isPasswordValid = await bcrypt.compare(data.datap.password, user.password);
    if (!isPasswordValid) {
      return {
        error: {
          errors: [{ message: 'Senha inválida', path: ['password'], code: 'custom' }],
        },
      };
    }

    // Gerar token JWT
    const payload = { sub: user.id, email: user.email, data: ["api-ler-pokemon"] };
    const token = this.jwtService.sign(payload);

    console.log('Login realizado com sucesso');
    return {
      token,
    };
  }
}