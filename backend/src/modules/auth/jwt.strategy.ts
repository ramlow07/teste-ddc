import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lê o header Authorization
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'ddc-secret-key',
    });
  }

  async validate(payload: any) {
     console.log("Payload validado pelo JWT:", payload);
    // chamado automaticamente se o token for válido
    return {
      sub: payload.sub,
      email: payload.email,
      data: payload.data,
    };
  }
}
