import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigurationModule } from 'woorkroom/config';
import { RabbitmqMailsService } from './services';

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'MAILS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.mails'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  providers: [
    {
      provide: RabbitmqMailsService.name,
      useClass: RabbitmqMailsService,
    },
  ],
  exports: [RabbitmqMailsService.name],
})
export class RabbitmqModule {}
