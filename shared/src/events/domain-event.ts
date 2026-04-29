export type DomainEventPayload = Record<string, unknown>;
export type DomainEventMetadata = Record<string, unknown>;

export interface DomainEvent<
  Payload extends DomainEventPayload = DomainEventPayload,
  Metadata extends DomainEventMetadata = DomainEventMetadata,
> {
  readonly id: string;
  readonly type: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Payload;
  readonly metadata: Metadata;
  readonly occurredAt: Date;
}
