import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { CreateUserDto } from '../dto';
import { IUser } from '../types';
import { cleanedDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<IUser> {
    try {
      const existingUser = await this.getByEmail(dto.email);
      if (existingUser) {
        throw new ForbiddenException('User with this email already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: dto.password,
          phoneNumber: dto.phoneNumber,
          status: dto.status,
          role: dto.role,
        },
      });

      console.log('user', user)

      return user;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateUser(id: number, dto: Partial<CreateUserDto>): Promise<IUser> {
    const existingUser = await this.getById(id);
    if (!existingUser) {
      throw new RpcException('User not found');
    }

    const data = cleanedDto(dto);

    if (data.email) {
      const existingEmailUser = await this.getByEmail(data.email);
      if (existingEmailUser && existingEmailUser.id !== id) {
        throw new RpcException('User with this email already exists');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return updatedUser;
  }

  async getById(id: number): Promise<IUser | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteById(id: number): Promise<boolean> {
    const existingUser = await this.getById(id);
    if (!existingUser) {
      throw new RpcException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return true;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const existingUser = await this.getByEmail(email);
    if (!existingUser) {
      throw new RpcException('User not found');
    }

    await this.prisma.user.delete({
      where: { email },
    });

    return true;
  }
}
