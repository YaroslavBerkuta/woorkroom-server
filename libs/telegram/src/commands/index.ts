import { StartCommand } from './start.command';
import { ShareContactCommand } from './share-contact.command';

export * from './command';
export * from './start.command';
export * from './share-contact.command';

export const commands = [StartCommand, ShareContactCommand];
