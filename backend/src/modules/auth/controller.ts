import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './service';
import { AuthResponse, LoginDTO, SignupDTO } from './entities/entities';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(@Args('data') data: SignupDTO): Promise<AuthResponse> {
    return await this.authService.signup({ datap: data, method: 'signup', tokenData: {sub: "userId", data: ""}, customData: {}, error: undefined });
  }
  
  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('data') data: LoginDTO): Promise<AuthResponse> {
    return await this.authService.login({ datap: data, method: 'login', tokenData: { sub: "", data: {} }, customData: {}, error: undefined });
  }
}