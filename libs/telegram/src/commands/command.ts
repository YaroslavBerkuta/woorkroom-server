import { Logger } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';

export abstract class Command {
  private static catchRegistered = false;
  private static readonly catchLogger = new Logger('Telegraf');

  protected readonly logger = new Logger(this.constructor.name);

  constructor(public bot: Telegraf<Context>) {
    if (!Command.catchRegistered) {
      Command.catchRegistered = true;

      this.bot.catch((err, ctx) => {
        const commandName = Command.getCommandNameFromContext(ctx);
        const suffix = commandName ? ` (command=${commandName})` : '';

        Command.catchLogger.error(`Telegraf error${suffix}`, err as any);
      });
    }
  }

  private static getCommandNameFromContext(ctx: Context): string | undefined {
    const anyCtx = ctx as any;

    const messageText: unknown =
      anyCtx?.message?.text ?? anyCtx?.update?.message?.text;
    if (typeof messageText === 'string') {
      const firstToken = messageText.trim().split(/\s+/)[0];
      if (firstToken?.startsWith('/')) {
        return firstToken;
      }
    }

    const callbackData: unknown = anyCtx?.callbackQuery?.data;
    if (typeof callbackData === 'string' && callbackData.length > 0) {
      return `callback:${callbackData}`;
    }

    const updateType: unknown = anyCtx?.updateType;
    if (typeof updateType === 'string' && updateType.length > 0) {
      return `update:${updateType}`;
    }

    return undefined;
  }

  abstract handler(): void;
}
