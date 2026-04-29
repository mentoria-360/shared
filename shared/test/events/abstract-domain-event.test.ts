import { AbstractDomainEvent } from '../../src/events/abstract-domain-event';

class TestDomainEvent extends AbstractDomainEvent<{ from: string; to: string }, { userId: string }> {
  constructor(input: { aggregateId: string; payload: { from: string; to: string }; metadata?: { userId: string } }) {
    super({
      type: 'test.changed',
      aggregateType: 'TestAggregate',
      aggregateId: input.aggregateId,
      payload: input.payload,
      metadata: input.metadata,
    });
  }
}

describe('AbstractDomainEvent', () => {
  test('should initialize common event fields with defaults', () => {
    const event = new TestDomainEvent({
      aggregateId: '550e8400-e29b-41d4-a716-446655440000',
      payload: { from: 'old', to: 'new' },
      metadata: { userId: '550e8400-e29b-41d4-a716-446655440001' },
    });

    expect(event.id).toBeDefined();
    expect(event.type).toBe('test.changed');
    expect(event.aggregateType).toBe('TestAggregate');
    expect(event.aggregateId).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(event.payload).toEqual({ from: 'old', to: 'new' });
    expect(event.metadata).toEqual({
      userId: '550e8400-e29b-41d4-a716-446655440001',
    });
    expect(event.occurredAt).toBeInstanceOf(Date);
  });
});
