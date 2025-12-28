import { Module } from '@nestjs/common';
import { DatabaseModule } from 'woorkroom/database';
import { ConfigurationModule } from 'woorkroom/config';
import { entities } from './entitys';
import { UsersService } from './services';
import { UsersController } from './controllers';

@Module({
  imports: [ConfigurationModule, DatabaseModule.forUsers(entities)],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService.name,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
