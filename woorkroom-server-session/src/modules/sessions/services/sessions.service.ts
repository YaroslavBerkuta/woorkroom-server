import { PrismaService } from 'src/libs/database/prisma.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from '../dto';
import { USER_SERVICE } from 'src/libs/rmq/types';

export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    await firstValueFrom(this.userClient.send({ cmd: 'user.create' }, dto));
  }
}
