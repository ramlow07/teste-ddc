import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor() {
    super()
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context)


    if (!request.headers.authorization) {
      throw new UnauthorizedException({ message: 'No authorization header' })
    }

    const tokenPayload = this.getTokenPayload(request)
    if (!tokenPayload) {
      throw new UnauthorizedException({ message: 'Invalid token' })
    }

    request.jwtUserId = tokenPayload.sub
    request.tokenData = tokenPayload.data
    // TODO: Further token verification if necessary

    return super.canActivate(context)
  }

  private getTokenPayload(request) {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split(' ')[1]

    if (!token || !token.includes('.')) {
      return null
    }

    try {
      const base64Payload = token.split('.')[1]
      const payload = Buffer.from(base64Payload, 'base64').toString()
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }
}
