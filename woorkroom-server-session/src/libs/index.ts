import { DatabaseModule } from './database/database.module';
import { GraphQlModule } from './graphQl/graphQl.module';
import { RedisCashModule } from './redis/redis.module';
import { RmqModule } from './rmq/rmq.module';

export const LIBS_MODULES = [
  DatabaseModule,
  RmqModule,
  GraphQlModule,
  RedisCashModule
];
