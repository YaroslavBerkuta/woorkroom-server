import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/libs/rmq/types';

export const rmqClients: ClientsModuleOptions = [
  {
    name: USER_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  },
];
