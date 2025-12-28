import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from 'shared';
import { IUserServiceInterface } from '../types';
import { omit } from 'lodash';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements IUserServiceInterface {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}

  public async create(dto: CreateUserDto) {
    const existUser = await this.findOneByEmail(dto.email);

    if (existUser) {
      throw new RpcException('User already exists');
    }

    return this.usersRepository.save({
      ...dto,
      password: await this.hashPassword(dto.password),
    });
  }

  public async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  public async findOneById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      return user;
    } catch (error) {
      throw new RpcException('User not found');
    }
  }

  public async deleteById(id: string) {
    const result = await this.usersRepository.delete({ id });
    return !!result.affected;
  }

  public async updateById(id: string, dto: Omit<UpdateUserDto, 'id'>) {
    await this.usersRepository.update({ id }, omit(dto, ['id']));
    return this.findOneById(id);
  }

  public verifyPassword(hashValue: string, password: string): Promise<boolean> {
    const pepper = this.configService.get<string>('security.passwordPepper');

    if (!pepper) {
      throw new RpcException('Something went wrong');
    }
    return compare(password.normalize('NFKC') + pepper, hashValue);
  }

  protected async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>(
      'security.passwordSaltRounds',
    );
    const pepper = this.configService.get<string>('security.passwordPepper');

    if (!saltRounds || !pepper) {
      throw new RpcException('Something went wrong');
    }

    const newPass = await hash(password.normalize('NFKC') + pepper, saltRounds);
    return newPass;
  }
}
