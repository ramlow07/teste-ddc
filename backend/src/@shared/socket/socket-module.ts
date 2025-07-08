import { Module } from '@nestjs/common'
import { NotificationSocket } from './socket'

@Module({
  providers: [NotificationSocket],
  exports: [NotificationSocket],
})
export class NotificationModule {}
