import { AggregateRoot, EntityProps } from '../../src/base';
import { DomainEvent } from '../../src/events';

type TestEvent = DomainEvent<{ value: number }, { actorId: string }>;

interface TestAggregateProps extends EntityProps {}

class TestEventSource extends AggregateRoot<TestEventSource, TestAggregateProps, TestEvent> {
  constructor() {
    super({ id: '550e8400-e29b-41d4-a716-446655440100' });
  }

  emit(event: TestEvent) {
    this.addEvent(event);
  }
}

const eventA: TestEvent = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  type: 'test.a',
  aggregateType: 'TestAggregate',
  aggregateId: '550e8400-e29b-41d4-a716-446655440010',
  payload: { value: 1 },
  metadata: { actorId: '550e8400-e29b-41d4-a716-446655440020' },
  occurredAt: new Date('2026-03-17T00:00:00.000Z'),
};

const eventB: TestEvent = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  type: 'test.b',
  aggregateType: 'TestAggregate',
  aggregateId: '550e8400-e29b-41d4-a716-446655440010',
  payload: { value: 2 },
  metadata: { actorId: '550e8400-e29b-41d4-a716-446655440020' },
  occurredAt: new Date('2026-03-17T00:01:00.000Z'),
};

describe('AggregateRoot', () => {
  test('should accumulate events and expose snapshot with peekEvents', () => {
    const source = new TestEventSource();
    source.emit(eventA);
    source.emit(eventB);

    expect(source.hasEvents()).toBe(true);
    expect(source.peekEvents()).toEqual([eventA, eventB]);
  });

  test('should pull events in order and clear internal queue', () => {
    const source = new TestEventSource();
    source.emit(eventA);
    source.emit(eventB);

    const pulled = source.pullEvents();

    expect(pulled).toEqual([eventA, eventB]);
    expect(source.hasEvents()).toBe(false);
    expect(source.peekEvents()).toEqual([]);
  });

  test('should clear events manually', () => {
    const source = new TestEventSource();
    source.emit(eventA);

    source.clearEvents();

    expect(source.hasEvents()).toBe(false);
    expect(source.peekEvents()).toEqual([]);
  });
});
