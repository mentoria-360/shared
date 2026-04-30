import { Id } from '../vo/id.vo';
import { DomainEvent, DomainEventMetadata, DomainEventPayload } from './domain-event';

export interface AbstractDomainEventProps<Payload extends DomainEventPayload, Metadata extends DomainEventMetadata> {
  id?: string;
  occurredAt?: Date;
  metadata?: Metadata;
  payload: Payload;
  type: string;
  aggregateType: string;
  aggregateId: string;
}

export abstract class AbstractDomainEvent<
  Payload extends DomainEventPayload = DomainEventPayload,
  Metadata extends DomainEventMetadata = DomainEventMetadata,
> implements DomainEvent<Payload, Metadata> {
  readonly id: string;
  readonly type: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Payload;
  readonly metadata: Metadata;
  readonly occurredAt: Date;

  protected constructor(props: AbstractDomainEventProps<Payload, Metadata>) {
    this.id = Id.create(props.id, { attribute: 'id' }).value;
    this.type = this.ensureRequiredValue(props.type, 'type');
    this.aggregateType = this.ensureRequiredValue(props.aggregateType, 'aggregateType');
    this.aggregateId = Id.create(props.aggregateId, {
      attribute: 'aggregateId',
    }).value;
    this.payload = props.payload;
    this.metadata = (props.metadata ?? ({} as Metadata)) as Metadata;
    this.occurredAt = props.occurredAt ?? new Date();
  }

  private ensureRequiredValue(value: string, attribute: string): string {
    const normalizedValue = value?.trim();
    if (!normalizedValue) {
      throw new Error(`INVALID_${attribute.toUpperCase()}`);
    }

    return normalizedValue;
  }
}
