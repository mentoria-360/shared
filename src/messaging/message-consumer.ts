import { Result } from '../base';
import { BrokerMessage } from './message-publisher';

export const MESSAGE_CONSUMER = Symbol('MESSAGE_CONSUMER');

export interface ConsumeMessageIn {
  readonly channel?: string;
  readonly queue: string;
  readonly routingKeys: string[];
  readonly onMessage: (message: BrokerMessage) => Promise<Result<void>>;
}

export interface MessageConsumer {
  subscribe(input: ConsumeMessageIn): Promise<Result<void>>;
}

export interface EventConsumer {
  readonly eventType: string;
  handle(message: BrokerMessage): Promise<Result<void>>;
}
