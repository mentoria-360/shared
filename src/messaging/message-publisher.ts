import { Result } from '../base';

export const MESSAGE_PUBLISHER = Symbol('MESSAGE_PUBLISHER');

export interface BrokerMessage {
  readonly messageId: string;
  readonly type: string;
  readonly payload: Record<string, unknown>;
  readonly metadata: Record<string, unknown>;
  readonly occurredAt: Date;
}

export interface PublishMessageOptions {
  readonly queue?: string;
  readonly channel?: string;
  readonly exchange?: string;
  readonly routingKey?: string;
  readonly headers?: Record<string, unknown>;
}

export interface PublishMessageIn {
  readonly message: BrokerMessage;
  readonly options?: PublishMessageOptions;
}

export interface MessagePublisher {
  publish(message: PublishMessageIn): Promise<Result<void>>;
}
