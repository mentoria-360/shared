import { AggregateRoot, EntityDiff, EntityProps, Result } from '../../src/base';
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

interface OrderProps extends EntityProps {
  status: string;
}

class OrderForTest extends AggregateRoot<OrderForTest, OrderProps, TestEvent> {
  static cloneHookEvent: TestEvent | null = null;

  private constructor(props: OrderProps) {
    super(props);
  }

  static tryCreate(props: OrderProps): Result<OrderForTest> {
    if (!props.status) return Result.fail('STATUS_REQUIRED');
    return Result.ok(new OrderForTest(props));
  }

  get status() {
    return this.props.status;
  }

  changeStatus(status: string, event: TestEvent): Result<OrderForTest> {
    const next = this.cloneWith({ status });
    if (next.isFailure) return next;
    next.instance.addEvent(event);
    return next;
  }

  protected override onClone(_previous: this, _diff: EntityDiff<OrderProps>): void {
    if (OrderForTest.cloneHookEvent) this.addEvent(OrderForTest.cloneHookEvent);
  }
}

describe('AggregateRoot.cloneWith', () => {
  const orderId = '550e8400-e29b-41d4-a716-446655440200';

  afterEach(() => {
    OrderForTest.cloneHookEvent = null;
  });

  test('should keep the events of every step in a chain of clones', () => {
    const order = OrderForTest.tryCreate({ id: orderId, status: 'PLACED' }).instance;

    const paid = order.changeStatus('PAID', eventA).instance;
    const confirmed = paid.changeStatus('CONFIRMED', eventB).instance;

    expect(confirmed.status).toBe('CONFIRMED');
    expect(confirmed.pullEvents()).toEqual([eventA, eventB]);
  });

  test('should leave the pending events of the previous instance untouched', () => {
    const order = OrderForTest.tryCreate({ id: orderId, status: 'PLACED' }).instance;
    const paid = order.changeStatus('PAID', eventA).instance;

    const confirmed = paid.changeStatus('CONFIRMED', eventB).instance;
    confirmed.pullEvents();

    expect(order.peekEvents()).toEqual([]);
    expect(paid.peekEvents()).toEqual([eventA]);
    expect(confirmed.hasEvents()).toBe(false);
  });

  test('should add events from onClone after the carried ones', () => {
    const order = OrderForTest.tryCreate({ id: orderId, status: 'PLACED' }).instance;
    const paid = order.changeStatus('PAID', eventA).instance;

    OrderForTest.cloneHookEvent = eventB;
    const cloned = paid.cloneWith({ status: 'CONFIRMED' }).instance;

    expect(cloned.peekEvents()).toEqual([eventA, eventB]);
  });

  test('should not carry events when the clone fails validation', () => {
    const order = OrderForTest.tryCreate({ id: orderId, status: 'PLACED' }).instance;
    const paid = order.changeStatus('PAID', eventA).instance;

    const failed = paid.cloneWith({ status: '' });

    expect(failed.isFailure).toBe(true);
    expect(paid.peekEvents()).toEqual([eventA]);
  });
});
