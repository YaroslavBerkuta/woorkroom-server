import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './modules';
import { LIBS_MODULES } from './libs';

@Module({
  imports: [
    ...LIBS_MODULES,
    UsersModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      playground: true,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
})
export class AppModule {}
