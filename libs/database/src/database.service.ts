import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  public connect(): Promise<void> {
    console.log('Database test connection successful');
    return Promise.resolve();
  }

  public async ping(): Promise<boolean> {
    console.log('Database ping successful');
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }
}
