import { Result } from '../base/result';
import { ValidationError } from '../errors/validation-error';
import { Id } from '../vo/id.vo';
import {
  DomainEvent,
  DomainEventMetadata,
  DomainEventPayload,
} from './domain-event';

export interface AbstractDomainEventProps<
  Payload extends DomainEventPayload,
  Metadata extends DomainEventMetadata,
> {
  id?: string;
  occurredAt?: Date;
  metadata?: Metadata;
  payload: Payload;
  type: string;
  aggregateType: string;
  aggregateId: string;
}

export interface ResolvedDomainEventProps<
  Payload extends DomainEventPayload,
  Metadata extends DomainEventMetadata,
> {
  readonly id: string;
  readonly type: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Payload;
  readonly metadata: Metadata;
  readonly occurredAt: Date;
}

export abstract class AbstractDomainEvent<
  Payload extends DomainEventPayload = DomainEventPayload,
  Metadata extends DomainEventMetadata = DomainEventMetadata,
> implements DomainEvent<Payload, Metadata>
{
  readonly id: string;
  readonly type: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Payload;
  readonly metadata: Metadata;
  readonly occurredAt: Date;

  protected constructor(props: ResolvedDomainEventProps<Payload, Metadata>) {
    this.id = props.id;
    this.type = props.type;
    this.aggregateType = props.aggregateType;
    this.aggregateId = props.aggregateId;
    this.payload = props.payload;
    this.metadata = props.metadata;
    this.occurredAt = props.occurredAt;
  }

  protected static tryCreateFromProps<
    Payload extends DomainEventPayload,
    Metadata extends DomainEventMetadata,
    T extends AbstractDomainEvent<Payload, Metadata>,
  >(
    props: AbstractDomainEventProps<Payload, Metadata>,
    factory: (props: ResolvedDomainEventProps<Payload, Metadata>) => T,
  ): Result<T> {
    return Result.try(() => {
      const resolved = AbstractDomainEvent.resolveProps(props);
      return factory(resolved);
    });
  }

  protected static createFromProps<
    Payload extends DomainEventPayload,
    Metadata extends DomainEventMetadata,
    T extends AbstractDomainEvent<Payload, Metadata>,
  >(
    props: AbstractDomainEventProps<Payload, Metadata>,
    factory: (props: ResolvedDomainEventProps<Payload, Metadata>) => T,
  ): T {
    const result = AbstractDomainEvent.tryCreateFromProps(props, factory);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  private static resolveProps<
    Payload extends DomainEventPayload,
    Metadata extends DomainEventMetadata,
  >(
    props: AbstractDomainEventProps<Payload, Metadata>,
  ): ResolvedDomainEventProps<Payload, Metadata> {
    const id = Id.create(props.id, { meta: { attribute: 'id' } }).value;
    const type = AbstractDomainEvent.ensureRequiredString(props.type, 'type');
    const aggregateType = AbstractDomainEvent.ensureRequiredString(
      props.aggregateType,
      'aggregate-type',
    );
    const aggregateIdResult = Id.required(props.aggregateId, {
      meta: { attribute: 'aggregateId' },
    });
    aggregateIdResult.validator.throwsIfFailed();
    const aggregateId = aggregateIdResult.instance.value;

    return {
      id,
      type,
      aggregateType,
      aggregateId,
      payload: props.payload,
      metadata: (props.metadata ?? ({} as Metadata)) as Metadata,
      occurredAt: props.occurredAt ?? new Date(),
    };
  }

  private static ensureRequiredString(
    value: string,
    attribute: 'type' | 'aggregate-type',
  ): string {
    const normalizedValue = value?.trim();
    if (!normalizedValue) {
      throw new ValidationError({ code: `domain-event.${attribute}.invalid` });
    }

    return normalizedValue;
  }
}
