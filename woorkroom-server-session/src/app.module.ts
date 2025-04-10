import { Module } from '@nestjs/common';
import { LIBS_MODULES } from './libs';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { SessionsModule } from './modules';

@Module({
  imports: [
    ...LIBS_MODULES,
    SessionsModule,
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
