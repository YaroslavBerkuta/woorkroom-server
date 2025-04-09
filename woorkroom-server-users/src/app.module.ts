import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { LIBS_MODULES, UsersModule } from './modules';

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
