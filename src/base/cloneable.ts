import Metadata from "../base/metadata"
import Result from "./result"

export interface CloneableProps {
	[key: string]: unknown
}

export default abstract class Cloneable<Tipo, Props extends object> {
	constructor(
		readonly props: Props,
		readonly meta?: Metadata,
	) {}

	clone(newProps: Partial<Props>, ...args: any[]): Result<Tipo> {
		return Result.try(
			() =>
				new (this.constructor as any)(
					{
						...this.props,
						...newProps,
					},
					this.meta,
					...args,
				) as Tipo,
		)
	}
}
