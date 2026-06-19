import Entity, { EntityProps } from "./entity"
import Metadata from "./metadata"

export default abstract class AggregateRoot<
	Type,
	Props extends EntityProps,
	Event = unknown,
> extends Entity<Type, Props> {
	private pendingEvents: Event[] = []

	protected constructor(props: Props, meta?: Metadata) {
		super(props, meta)
	}

	protected addEvent(event: Event): void {
		this.pendingEvents.push(event)
	}

	hasEvents(): boolean {
		return this.pendingEvents.length > 0
	}

	peekEvents(): readonly Event[] {
		return [...this.pendingEvents]
	}

	pullEvents(): Event[] {
		const events = [...this.pendingEvents]
		this.clearEvents()
		return events
	}

	clearEvents(): void {
		this.pendingEvents = []
	}
}

export { AggregateRoot }
