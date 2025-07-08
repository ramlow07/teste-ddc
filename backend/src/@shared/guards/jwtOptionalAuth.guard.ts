import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { verify } from 'jsonwebtoken'
import { Observable } from 'rxjs'

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor() {
    super()
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context)
    const token = request.headers?.authorization?.split(' ')?.pop()

    try {
      verify(token, process.env.JWT_SECRET_KEY)
      const tokenPayload = this.getTokenPayload(request)
      request.responsibleUserId = tokenPayload?.sub
    } catch (error) {
      request.responsibleUserId = undefined
    }

    return true
  }

  private getTokenPayload(request) {
    const header = request.headers.authorization
    if (!header) {
      return null
    }
    const token = header.split(' ')?.pop()
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  }
}
