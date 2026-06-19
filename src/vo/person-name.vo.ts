import { Result } from "../base"
import Metadata from "../base/metadata"
import ValidationError from "../base/validation.error"

export default class PersonName {
	readonly min: number = 4
	readonly max: number = 120

	constructor(
		readonly value?: string,
		readonly meta?: Metadata,
	) {
		this.value = value?.trim() ?? ""

		if (!value && this.min > 0) {
			throw new ValidationError({
				code: "person-name.empty",
				meta: meta?.withValue(value).props,
			})
		}

		if (value!.length < this.min) {
			throw new ValidationError({
				code: "person-name.too-short",
				meta: meta?.withValue(value).props,
			})
		}

		if (value!.length > this.max) {
			throw new ValidationError({
				code: "person-name.too-long",
				meta: meta?.withValue(value).props,
			})
		}

		if (!/^[a-zA-ZÀ-ú'\.-\s]*$/.test(value!)) {
			throw new ValidationError({
				code: "person-name.invalid",
				meta: meta?.withValue(value).props,
			})
		}

		if (value!.split(" ").length < 2) {
			throw new ValidationError({
				code: "person-name.surname-missing",
				meta: meta?.withValue(value).props,
			})
		}
	}

	static create(value?: string, meta?: Metadata): PersonName {
		const result = PersonName.tryCreate(value, meta)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static tryCreate(value?: string, meta?: Metadata): Result<PersonName> {
		return Result.try(() => new PersonName(value, meta))
	}

	get firstName() {
		return this.value!.split(" ")[0]!
	}

	get lastNames(): string[] {
		return this.value!.split(" ").slice(1)
	}

	get lastName(): string {
		return this.value!.split(" ").pop() as string
	}

	get initials(): string {
		return this.firstName[0]! + this.lastName[0]!
	}
}
