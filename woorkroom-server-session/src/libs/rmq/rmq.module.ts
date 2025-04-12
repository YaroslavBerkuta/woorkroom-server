import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { rmqClients } from 'src/config';

@Module({
  imports: [ClientsModule.register(rmqClients)],
  exports: [ClientsModule],
})
export class RmqModule {}
