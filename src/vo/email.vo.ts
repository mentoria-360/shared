import ValidationError from "../base/validation.error"
import Metadata from "../base/metadata"
import { Result } from "../base"

export default class Email {
	constructor(
		readonly value: string,
		readonly meta?: Metadata,
	) {
		this.value = value?.trim().toLocaleLowerCase() ?? ""

		if (!Email.isValid(value)) {
			throw new ValidationError({
				code: "email.invalid",
				meta: meta?.withValue(value).props,
			})
		}
	}

	static create(value: string, meta?: Metadata): Email {
		const result = Email.tryCreate(value, meta)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static tryCreate(value: string, meta?: Metadata): Result<Email> {
		return Result.try(() => new Email(value, meta))
	}

	get username(): string {
		return this.value!.split("@")[0]!
	}

	get domain(): string {
		return this.value!.split("@")[1]!
	}

	static isValid(email: string): boolean {
		const regex =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
		return regex.test(email)
	}
}
