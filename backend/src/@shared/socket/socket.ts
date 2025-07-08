import { Injectable } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class NotificationSocket implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private messages = new Map<string, string[]>()
  private activeUsers = new Map<string, Set<string>>()
  private lastActivity = new Map<string, number>()

  private readonly TIMEOUT = 6 * 60 * 1000

  constructor() {
    setInterval(() => this.checkInactiveUsers(), this.TIMEOUT)
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string

    if (userId) {
      if (this.activeUsers.has(userId)) {
        this.activeUsers.get(userId)?.add(client.id)
      } else {
        this.activeUsers.set(userId, new Set([client.id]))
      }

      this.updateUserActivity(userId)
    }

    client.emit('historico', this.messages.get(userId) || [])
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.activeUsers.entries()).find(([_, socketIds]) => socketIds.has(client.id))?.[0]

    if (userId) {
      const userSockets = this.activeUsers.get(userId)
      if (userSockets) {
        userSockets.delete(client.id)

        if (userSockets.size === 0) {
          this.activeUsers.delete(userId)
        }
      }
    }
  }

  verifyClientIsConected(userId: string): boolean {
    return this.activeUsers.has(userId) && (this.activeUsers.get(userId)?.size ?? 0) > 0
  }

  @SubscribeMessage('mensagem')
  handleMessage(@MessageBody() data: { userId: string; message: string }): void {
    const { userId, message } = data

    if (!this.messages.has(userId)) {
      this.messages.set(userId, [])
    }
    this.messages.get(userId)?.push(message)

    const userSockets = this.activeUsers.get(userId)
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit('resposta', message)
      })
    }

    this.updateUserActivity(userId)
  }

  handleSendMessage(@MessageBody() data: { emitString: string; userId: string; message: string }): void {
    //emit hellow world to user
    const userSockets = this.activeUsers.get(data.userId)
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit(data.emitString, data.message)
      })
    }

    this.updateUserActivity(data.userId)
  }

  private updateUserActivity(userId: string): void {
    this.lastActivity.set(userId, Date.now())
  }

  private checkInactiveUsers(): void {
    const now = Date.now()
    this.lastActivity.forEach((lastActive, userId) => {
      if (now - lastActive > this.TIMEOUT) {
        this.server.to(Array.from(this.activeUsers.get(userId) || [])).emit('usuario_inativo', userId)
        this.lastActivity.delete(userId)
        this.activeUsers.delete(userId)
      }
    })
  }
}
