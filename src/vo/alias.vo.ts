import { Result } from "../base"
import Metadata from "../base/metadata"
import ValidationError from "../base/validation.error"

export default class Alias {
	constructor(
		readonly value: string,
		readonly meta?: Metadata,
	) {
		if (!Alias.isValid(value)) {
			throw new ValidationError({
				code: "alias.invalid",
				meta: meta?.withValue(value).props,
			})
		}
	}

	static create(value: string, meta?: Metadata): Alias {
		const result = Alias.tryCreate(value, meta)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static tryCreate(value: string, meta?: Metadata): Result<Alias> {
		return Result.try(() => new Alias(value, meta))
	}

	static format(text: string): string {
		return text
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-/, "")
			.replace(/[^a-z0-9-]/g, "")
	}

	static isValid(text: string): boolean {
		return /^[a-z0-9-]+$/.test(text)
	}
}
