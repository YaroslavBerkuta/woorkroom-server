import { Module } from '@nestjs/common';
import { DatabaseModule } from 'woorkroom/database';
import { ConfigurationModule } from 'woorkroom/config';
import { entities } from './entitys';
import { ProfilesService, UsersService } from './services';
import { ProfileController, UsersController } from './controllers';

@Module({
  imports: [ConfigurationModule, DatabaseModule.forUsers(entities)],
  controllers: [UsersController, ProfileController],
  providers: [
    {
      provide: UsersService.name,
      useClass: UsersService,
    },
    {
      provide: ProfilesService.name,
      useClass: ProfilesService,
    },
  ],
})
export class UsersModule {}
