import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigurationModule } from 'woorkroom/config';
import { RabbitmqUsersService } from './services';

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'USER_SERVICE',
        useFactory: (config: ConfigService) => ({
          options: {
            transport: Transport.RMQ,
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.users'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  providers: [
    {
      provide: RabbitmqUsersService.name,
      useClass: RabbitmqUsersService,
    },
  ],
  exports: [RabbitmqUsersService.name],
})
export class RabbitmqModule {}
