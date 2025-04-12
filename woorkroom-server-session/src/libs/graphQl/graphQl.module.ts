import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      playground: true,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
})
export class GraphQlModule implements OnModuleInit {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(GraphQlModule.name);
  }
  onModuleInit() {
    this.logger.debug(
      'GraphQl module initialized:',
      `http://localhost:3002/graphql`,
    );
  }
}
