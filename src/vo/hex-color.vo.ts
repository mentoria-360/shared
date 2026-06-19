import ValidationError from "../base/validation.error"
import Metadata from "../base/metadata"
import { Result } from "../base"

export default class HexColor {
	constructor(
		readonly value: string,
		readonly meta?: Metadata,
	) {
		this.value = value?.trim() ?? ""

		if (!HexColor.isValid(value)) {
			throw new ValidationError({
				code: "hexcolor.invalid",
				meta: meta?.withValue(value).props,
			})
		}
	}

	static create(value: string, meta?: Metadata): HexColor {
		const result = HexColor.tryCreate(value, meta)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static tryCreate(value: string, meta?: Metadata): Result<HexColor> {
		return Result.try(() => new HexColor(value, meta))
	}

	static isValid(color: string): boolean {
		const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
		return regex.test(color)
	}
}
