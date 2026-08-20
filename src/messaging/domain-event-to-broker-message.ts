import { DomainEvent } from '../events/domain-event';
import { BrokerMessage } from './message-publisher';

export function domainEventToBrokerMessage(event: DomainEvent): BrokerMessage {
  return {
    messageId: event.id,
    type: event.type,
    payload: { ...event.payload, aggregateId: event.aggregateId, aggregateType: event.aggregateType },
    metadata: event.metadata,
    occurredAt: event.occurredAt,
  };
}
