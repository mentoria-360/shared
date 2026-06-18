import {
  AbstractDomainEvent,
  AbstractDomainEventProps,
  ResolvedDomainEventProps,
} from '../../src/events/abstract-domain-event';

type TestPayload = { from: string; to: string };
type TestMetadata = { userId: string };

class TestDomainEvent extends AbstractDomainEvent<TestPayload, TestMetadata> {
  private constructor(props: ResolvedDomainEventProps<TestPayload, TestMetadata>) {
    super(props);
  }

  static tryCreate(input: {
    aggregateId: string;
    payload: TestPayload;
    metadata?: TestMetadata;
  }) {
    return super.tryCreateFromProps(
      {
        type: 'test.changed',
        aggregateType: 'TestAggregate',
        aggregateId: input.aggregateId,
        payload: input.payload,
        metadata: input.metadata,
      },
      (props) => new TestDomainEvent(props),
    );
  }

  static create(input: { aggregateId: string; payload: TestPayload; metadata?: TestMetadata }) {
    const result = TestDomainEvent.tryCreate(input);
    result.validator.throwsIfFailed();
    return result.instance;
  }
}

class RawTestDomainEvent extends AbstractDomainEvent<TestPayload> {
  private constructor(props: ResolvedDomainEventProps<TestPayload, Record<string, unknown>>) {
    super(props);
  }

  static tryCreateWithProps(props: AbstractDomainEventProps<TestPayload, Record<string, unknown>>) {
    return super.tryCreateFromProps(props, (resolved) => new RawTestDomainEvent(resolved));
  }
}

describe('AbstractDomainEvent', () => {
  test('should initialize common event fields with defaults', () => {
    const event = TestDomainEvent.create({
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

  test('tryCreate should return Result.fail for invalid aggregateId', () => {
    const result = TestDomainEvent.tryCreate({
      aggregateId: '',
      payload: { from: 'old', to: 'new' },
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toEqual(['id.invalid']);
  });

  test('tryCreate should return Result.fail for invalid type', () => {
    const result = RawTestDomainEvent.tryCreateWithProps({
      type: '   ',
      aggregateType: 'TestAggregate',
      aggregateId: '550e8400-e29b-41d4-a716-446655440000',
      payload: { from: 'a', to: 'b' },
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toEqual(['domain-event.type.invalid']);
  });

  test('tryCreate should return Result.fail for invalid aggregateType', () => {
    const result = RawTestDomainEvent.tryCreateWithProps({
      type: 'test.changed',
      aggregateType: '',
      aggregateId: '550e8400-e29b-41d4-a716-446655440000',
      payload: { from: 'a', to: 'b' },
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toEqual(['domain-event.aggregate-type.invalid']);
  });
});
