import { Result } from "../base"
import ValidationError from "../base/validation.error"
import Metadata from "../base/metadata"

export default class Order {
	constructor(
		readonly value: number,
		meta?: Metadata,
	) {
		if (this.value < 0) {
			throw new ValidationError({
				code: "order.negative",
				meta: meta?.withValue(value).props,
			})
		}
	}

	static create(value: number, meta?: Metadata): Order {
		const result = Order.tryCreate(value, meta)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static tryCreate(value: number, meta?: Metadata): Result<Order> {
		return Result.try(() => new Order(value, meta))
	}

	static sort<T extends { order: Order | number }>(itemsInOrder: T[]): T[] {
		return itemsInOrder.sort((a, b) => {
			const orderA = a.order instanceof Order ? a.order.value : a.order
			const orderB = b.order instanceof Order ? b.order.value : b.order
			return orderA - orderB
		})
	}
}
