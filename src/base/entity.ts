import Cloneable from "./cloneable"
import Id from "../vo/id.vo"
import Metadata from "./metadata"
import Result from "./result"

export interface EntityProps {
	id?: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date | null
}

export default abstract class Entity<Type, Props extends EntityProps> extends Cloneable<
	Type,
	Props
> {
	readonly id: Id

	constructor(props: Props, meta?: Metadata) {
		super(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
				id: new Id(props.id).value,
			},
			meta?.withId(props.id),
		)
		this.id = new Id(props.id)
	}

	equals(entidade: Entity<Type, Props>): boolean {
		return this.id.equals(entidade.id)
	}

	notEquals(entidade: Entity<Type, Props>): boolean {
		return this.id.notEquals(entidade.id)
	}

	markAsDeleted(): Result<Type> {
		return this.clone({ deletedAt: new Date() } as Props)
	}

	clone(newProps: Partial<Props>, ...args: any[]): Result<Type> {
		return super.clone(
			{
				...newProps,
				updatedAt: new Date(),
			},
			...args,
		)
	}

	get createdAt(): Date {
		return this.props.createdAt!
	}

	get updatedAt(): Date {
		return this.props.updatedAt!
	}

	get deletedAt(): Date | null {
		return this.props.deletedAt ?? null
	}

	protected cloneMeta(attribute: string, value?: any): Metadata {
		if (this.meta) return this.meta.to(attribute, value)
		return new Metadata({ attribute, value })
	}
}
