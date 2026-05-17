import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigurationModule } from 'woorkroom/config';
import { RabbitmqMailsService, RabbitmqAuditService, RabbitmqActivityService } from './services';

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
      {
        inject: [ConfigService],
        name: 'AUDIT_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.audit'),
            queueOptions: { durable: true },
          },
        }),
      },
      {
        inject: [ConfigService],
        name: 'ACTIVITY_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.activity'),
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
    {
      provide: RabbitmqAuditService.name,
      useClass: RabbitmqAuditService,
    },
    {
      provide: RabbitmqActivityService.name,
      useClass: RabbitmqActivityService,
    },
  ],
  exports: [RabbitmqMailsService.name, RabbitmqAuditService.name, RabbitmqActivityService.name],
})
export class RabbitmqModule {}
