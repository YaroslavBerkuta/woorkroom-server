import { PrismaService } from 'src/libs/database/prisma.service';
import { ISession } from '../types';

export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(): Promise<ISession> {
    
  }
}
