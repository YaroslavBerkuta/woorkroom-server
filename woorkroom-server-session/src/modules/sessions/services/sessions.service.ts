import { PrismaService } from 'src/libs/database/prisma.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from '../dto';
import { MAIL_SERVICE, USER_SERVICE } from 'src/libs/rmq/types';
import { REDIS_SERVICE } from 'src/libs/redis/types';
import { RedisService } from 'src/libs/redis/redis.service';
import { generateRandomNumericCode } from 'src/common';
import { ISession, PASSWORD_HASH_SERVICE, QueueCommnadsEnum } from '../types';
import { PasswordHashService } from './password-hash.service';

export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
    @Inject(MAIL_SERVICE) private readonly mailClient: ClientProxy,
    @Inject(REDIS_SERVICE) private readonly redisService: RedisService,
    @Inject(PASSWORD_HASH_SERVICE)
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async getById(id: number): Promise<ISession> {
    try {
      const session = await this.prisma.session.findUnique({
        where: { id },
      });

      if (!session) throw new Error('Session not found');

      return session;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async register(dto: RegisterDto): Promise<any> {
    try {
      const codeInRedis = await this.redisService.get(
        `verification_code:${dto.phoneNumber}`,
      );

      if (dto.verificationCode !== codeInRedis) {
        throw new Error('You verification code not valid');
      }

      const hashPassword = await this.passwordHashService.hashPassword(
        dto.password,
      );

      const user = await firstValueFrom(
        this.userClient.send(
          { cmd: QueueCommnadsEnum.CREATE_USER },
          { ...dto, password: hashPassword },
        ),
      );

      console.log('user', user);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendVerificationCode(phone: string): Promise<any> {
    const code = generateRandomNumericCode(4);

    await this.redisService.setWithTTL(
      `verification_code:${phone}`,
      code,
      '1m',
    );

    this.mailClient.emit(QueueCommnadsEnum.SEND_CONFIRM_CODE, {
      to: phone,
      code,
    });
  }
}
