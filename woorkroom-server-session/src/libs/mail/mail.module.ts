import { Module } from '@nestjs/common';
import { TWILLO_CLIENT, TWILLO_SERVICE } from './types';
import * as Twilio from 'twilio';
import { provideFactory, provideService } from 'src/common';
import { TwilioService } from './services';

@Module({
  imports: [],
  providers: [
    provideFactory(TWILLO_CLIENT, () => {
      return Twilio(process.env.TWILILO_SID, process.env.TWILIO_TOKEN);
    }),
    provideService(TWILLO_SERVICE, TwilioService),
  ],
  exports: [TWILLO_SERVICE],
})
export class MailModule {}
