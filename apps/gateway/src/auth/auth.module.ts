import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers';

@Module({
  imports: [],
  providers: [AuthResolver],
})
export class AuthModule {}
