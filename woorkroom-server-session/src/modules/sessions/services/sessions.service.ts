import { PrismaService } from 'src/libs/database/prisma.service';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from '../dto';
import { USER_SERVICE } from 'src/libs/rmq/types';
import { REDIS_SERVICE } from 'src/libs/redis/types';
import { RedisService } from 'src/libs/redis/redis.service';
import { generateRandomNumericCode } from 'src/common';
import { TWILLO_SERVICE } from 'src/libs/mail/types';
import { TwilioService } from 'src/libs/mail/services';
import { PASSWORD_HASH_SERVICE } from '../types';
import { PasswordHashService } from './password-hash.service';

export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
    @Inject(REDIS_SERVICE) private readonly redisService: RedisService,
    @Inject(TWILLO_SERVICE) private readonly twilioService: TwilioService,
    @Inject(PASSWORD_HASH_SERVICE)
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    try {
      const codeInRedis = await this.redisService.get(
        `verification_code:${dto.phoneNumber}`,
      );

      console.log(
        codeInRedis,
        dto.verificationCode,
        dto.verificationCode !== codeInRedis,
      );

      if (dto.verificationCode !== codeInRedis) {
        throw new Error('You verification code not valid');
      }

      const hashPassword = await this.passwordHashService.hashPassword(
        dto.password,
      );

      const user = await firstValueFrom(
        this.userClient.send(
          { cmd: 'user.create' },
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

    console.log('code', code);

    // await this.twilioService.sendVerificationCode(phone, code);
  }
}
