import { Module } from '@nestjs/common';
import { SessionService } from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionsResolver } from './sessions.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [SessionService, SessionsResolver],
})
export class SessionsModule {}
