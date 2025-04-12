import { DatabaseModule } from './database/database.module';
import { GraphQlModule } from './graphQl/graphQl.module';
import { RedisCashModule } from './redis/redis.module';
export { RedisCashModule } from './redis/redis.module';

export const LIBS_MODULES = [DatabaseModule, GraphQlModule, RedisCashModule];
