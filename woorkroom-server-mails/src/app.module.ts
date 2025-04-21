import { Module } from '@nestjs/common';
import { provideFactory, provideService } from './common';
import * as Twilio from 'twilio';
import {
  TELEGRAM_BOT,
  TELEGRAM_SERVICE,
  TWILLO_CLIENT,
  TWILLO_SERVICE,
} from './types/consts';
import { TelegramService, TwilioService } from './services';
import TelegramBot = require('node-telegram-bot-api');
import { MailController } from './controllers';

@Module({
  providers: [
    provideFactory(TWILLO_CLIENT, () => {
      return Twilio(process.env.TWILILO_SID, process.env.TWILIO_TOKEN);
    }),
    provideService(TWILLO_SERVICE, TwilioService),
    provideFactory(TELEGRAM_BOT, () => {
      return new TelegramBot('8164427960:AAFUtvdPVLKitG4qRrIxQCXDSbTugMg_NCg', {
        polling: false,
      });
    }),
    provideService(TELEGRAM_SERVICE, TelegramService),
  ],
  controllers: [MailController],
  exports: [TELEGRAM_SERVICE],
})
export class AppModule {}
