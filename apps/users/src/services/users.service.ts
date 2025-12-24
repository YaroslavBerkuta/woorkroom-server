import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { hash } from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from 'shared';
import { IUserServiceInterface } from '../types';
import { omit } from 'lodash';

@Injectable()
export class UsersService implements IUserServiceInterface {
  private readonly SALT_ROUNDS = 10;
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public async create(dto: CreateUserDto) {
    const existUser = await this.findOneByEmail(dto.email);

    if (existUser) {
      throw new ConflictException('User already exists');
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
    return this.usersRepository.findOneBy({ id });
  }

  public async deleteById(id: string) {
    return this.usersRepository.delete({ id });
  }

  public async updateById(id: string, dto: Omit<UpdateUserDto, 'id'>) {
    await this.usersRepository.update({ id }, omit(dto, ['id']));
    return this.findOneById(id);
  }

  protected async hashPassword(password: string): Promise<string> {
    console.log(password);
    const newPass = await hash(password, this.SALT_ROUNDS);
    console.log(newPass);
    return newPass;
  }
}
