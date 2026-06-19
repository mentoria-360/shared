import { Result } from "../base"
import Metadata from "../base/metadata"
import ValidationError from "../base/validation.error"

export default class StrongPassword {
	static readonly REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

	constructor(
		readonly value?: string,
		readonly meta?: Metadata,
	) {
		if (!StrongPassword.isValid(value ?? "")) {
			throw new ValidationError({
				code: "strong-password.too-weak",
				meta: { ...meta?.props, value: undefined },
			})
		}
	}

	static create(value?: string, meta?: Metadata): StrongPassword {
		const result = StrongPassword.tryCreate(value, meta)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static tryCreate(value?: string, meta?: Metadata): Result<StrongPassword> {
		return Result.try(() => new StrongPassword(value, meta))
	}

	static isValid(password: string): boolean {
		return this.REGEX.test(password)
	}
}
