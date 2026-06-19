import { Result } from "../base"
import Text, { TextConfig } from "./text.vo"

export default class Description extends Text {
	protected static override readonly TOO_SHORT = "DESCRIPTION_TOO_SHORT"
	protected static override readonly TOO_LONG = "DESCRIPTION_TOO_LONG"
	protected static override readonly DEFAULT_MIN_LENGTH = 20
	protected static override readonly DEFAULT_MAX_LENGTH = 2000

	protected constructor(value: string, config?: TextConfig) {
		super(value, config)
	}

	static override create(value: string, config?: TextConfig): Description {
		const result = Description.tryCreate(value, config)
		result.validator.throwsIfFailed()
		return result.instance
	}

	static override tryCreate(text: string, config?: TextConfig): Result<Description> {
		try {
			const value = text?.trim() ?? ""
			const min = config?.minLength ?? this.DEFAULT_MIN_LENGTH
			const max = config?.maxLength ?? this.DEFAULT_MAX_LENGTH

			if (value.length < min) throw new Error(this.TOO_SHORT)
			if (max && value.length > max) throw new Error(this.TOO_LONG)

			return Result.ok(new Description(value, config))
		} catch (error: any) {
			return Result.fail(error.message)
		}
	}
}

export { Description }
