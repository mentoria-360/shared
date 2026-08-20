import { DomainEvent } from '../../src/events/domain-event';
import { domainEventToBrokerMessage } from '../../src/messaging/domain-event-to-broker-message';

function event(overrides: Partial<DomainEvent> = {}): DomainEvent {
  return {
    id: 'msg-1',
    type: 'member.invited',
    aggregateType: 'Membership',
    aggregateId: 'agg-1',
    payload: { email: 'a@b.com' },
    metadata: { userId: 'u-1' },
    occurredAt: new Date('2026-08-20T13:00:00.000Z'),
    ...overrides,
  };
}

describe('domainEventToBrokerMessage', () => {
  test('maps DomainEvent fields onto BrokerMessage and flattens aggregate context into payload', () => {
    const source = event();
    const message = domainEventToBrokerMessage(source);

    expect(message).toEqual({
      messageId: 'msg-1',
      type: 'member.invited',
      payload: {
        email: 'a@b.com',
        aggregateId: 'agg-1',
        aggregateType: 'Membership',
      },
      metadata: { userId: 'u-1' },
      occurredAt: source.occurredAt,
    });
  });

  test('does not mutate the original event payload', () => {
    const source = event();
    domainEventToBrokerMessage(source);
    expect(source.payload).toEqual({ email: 'a@b.com' });
  });
});
