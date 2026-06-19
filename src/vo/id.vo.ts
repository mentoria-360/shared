import { v4 as uuid, validate } from "uuid"
import Metadata from "../base/metadata"
import ValidationError from "../base/validation.error"
import { Result } from "../base"

export default class Id {
	readonly value: string

	constructor(
		value?: string,
		readonly meta?: Metadata,
	) {
		this.value = value ?? uuid()

		if (!Id.isValid(this.value)) {
			throw new ValidationError({
				code: "id.invalid",
				meta: { ...meta?.props, value: this.value },
			})
		}
	}

	static create(value?: string, meta?: Metadata) {
		return new Id(value, meta)
	}

	static tryCreate(value?: string, meta?: Metadata): Result<Id> {
		return Result.try(() => new Id(value, meta))
	}

	static createUUID() {
		return new Id().value
	}

	equals(id: Id) {
		return this.value === id.value
	}

	notEquals(id: Id) {
		return this.value !== id.value
	}

	static isValid(id: string): boolean {
		return validate(id)
	}
}
