import type Message from "./message"
import ValidationError from "./validation.error"

export type ResultErrorInput = string | string[] | Message | Message[] | Error | ValidationError

export default class ResultError extends Error {
	readonly errors: string[]

	constructor(error: ResultErrorInput) {
		const errors = ResultError.normalize(error)
		super(errors.join(", "))
		this.name = "ResultError"
		this.errors = errors
	}

	private static normalize(error: ResultErrorInput): string[] {
		if (error instanceof ValidationError) {
			return error.messages.map((msg) => msg.code ?? "error.unknown")
		}
		if (error instanceof Error) return [error.message]
		if (Array.isArray(error)) {
			return error.flatMap((item) =>
				typeof item === "string" ? item : item?.code ? item.code : "error.unknown",
			)
		}
		if (typeof error === "string") return [error]
		if (error?.code) return [error.code]
		return ["error.unknown"]
	}
}

export { ResultError }
