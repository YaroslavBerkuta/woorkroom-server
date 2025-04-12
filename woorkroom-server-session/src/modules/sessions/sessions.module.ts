import { Module } from '@nestjs/common';
import { SessionService } from './services';
import { SessionsResolver } from './resolvers';
import { RmqModule } from 'src/libs/rmq/rmq.module';


@Module({
  imports: [RmqModule],
  providers: [SessionService, SessionsResolver],
})
export class SessionsModule {}
