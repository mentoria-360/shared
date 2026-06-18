import { DomainEvent } from '../events/domain-event';
import { Entity, EntityDiff, EntityProps } from './entity';
import { Result } from './result';

export abstract class AggregateRoot<
  Type,
  Props extends EntityProps,
  Event extends DomainEvent = DomainEvent,
> extends Entity<Type, Props> {
  private pendingEvents: Event[] = [];

  protected addEvent(event: Event): void {
    this.pendingEvents.push(event);
  }

  public hasEvents(): boolean {
    return this.pendingEvents.length > 0;
  }

  public peekEvents(): readonly Event[] {
    return [...this.pendingEvents];
  }

  public pullEvents(): Event[] {
    const events = [...this.pendingEvents];
    this.clearEvents();
    return events;
  }

  public clearEvents(): void {
    this.pendingEvents = [];
  }

  public override cloneWith(overrides: Partial<Props>): Result<Type> {
    const { props, diff } = this.cloneProps(overrides);
    const clonedResult = (this.constructor as any).tryCreate(props) as Result<Type>;

    if (clonedResult.isFailure) {
      return clonedResult;
    }

    this.applyCloneEvents(clonedResult.instance as unknown as this, diff);

    return clonedResult;
  }

  protected applyCloneEvents(cloned: this, diff: EntityDiff<Props>): void {
    cloned.onClone(this, diff);
  }

  protected onClone(_previous: this, _diff: EntityDiff<Props>): void {}
}
