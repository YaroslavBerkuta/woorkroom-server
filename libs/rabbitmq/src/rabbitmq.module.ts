import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigurationModule } from 'woorkroom/config';
import {
  RabbitmqAuthService,
  RabbitmqCompanyService,
  RabbitmqMailsService,
  RabbitmqUsersService,
} from './services';

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'USER_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.users'),
            queueOptions: { durable: true },
          },
        }),
      },
      {
        inject: [ConfigService],
        name: 'COMPANY_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.companys'),
            queueOptions: { durable: true },
          },
        }),
      },
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
        name: 'AUTH_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get<string[]>('rmqp.urls'),
            queue: config.get<string>('rmqp.queue.authorization'),
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
    {
      provide: RabbitmqCompanyService.name,
      useClass: RabbitmqCompanyService,
    },
    {
      provide: RabbitmqAuthService.name,
      useClass: RabbitmqAuthService,
    },
    {
      provide: RabbitmqMailsService.name,
      useClass: RabbitmqMailsService,
    },
  ],
  exports: [
    RabbitmqUsersService.name,
    RabbitmqCompanyService.name,
    RabbitmqAuthService.name,
    RabbitmqMailsService.name
  ],
})
export class RabbitmqModule { }
