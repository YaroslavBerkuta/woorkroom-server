import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/libs/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(name: string, email: string) {
    return await this.prisma.user.create({
      data: { name, email, password: 'asd', phoneNumber: '1234567890' },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

}
