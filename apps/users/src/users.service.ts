import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'woorkroom/database';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {
    void this.databaseService.connect();
  }
}
