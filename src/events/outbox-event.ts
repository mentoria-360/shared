import { DomainEvent } from './domain-event';
import { DomainEventStatus } from './domain-event-status.enum';

export interface OutboxEvent extends DomainEvent {
  readonly status: DomainEventStatus;
  readonly publishedAt: Date | null;
}
