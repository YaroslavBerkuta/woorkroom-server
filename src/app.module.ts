import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DOMAINS_MODULES, LIBS_MODULES } from './modules';

@Module({
  imports: [
    ...DOMAINS_MODULES,
    ...LIBS_MODULES,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
