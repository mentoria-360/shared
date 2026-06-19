import Message from "./message"
import ResultValidator from "./result-validator"
import ValidationError from "./validation.error"

type ErrorMsg = string | Message | { message: string } | ValidationError

export default class Result<T> {
	constructor(
		readonly data?: T | null,
		readonly errors: Message[] = [],
	) {}

	static ok<T>(data?: T): Result<T> {
		return new Result<T>(data ?? null)
	}

	static null(): Result<null> {
		return Result.ok()
	}

	static empty<T>(): Result<T> {
		return new Result<T>(null)
	}

	static fail<T>(data: ErrorMsg | ErrorMsg[]): Result<T> {
		return new Result<T>(undefined, Result.getErrors(data))
	}

	static try<T>(fn: () => Promise<Result<T>>): Promise<Result<T>>
	static try<T>(fn: () => Promise<T>): Promise<Result<T>>
	static try<T>(fn: () => Result<T>): Result<T>
	static try<T>(fn: () => T): Result<T>
	static try<T>(fn: () => Promise<Result<T> | T> | Result<T> | T): Promise<Result<T>> | Result<T> {
		try {
			const result = fn()
			if (Result.isPromise(result)) {
				return result
					.then((resolved) => (resolved instanceof Result ? resolved : Result.ok<T>(resolved)))
					.catch((e: any) => Result.fail<T>(e))
			}

			return result instanceof Result ? result : Result.ok<T>(result)
		} catch (e: any) {
			return Result.fail<T>(e)
		}
	}

	static trySync<T>(fn: () => Promise<Result<T>>): Promise<Result<T>>
	static trySync<T>(fn: () => Promise<T>): Promise<Result<T>>
	static trySync<T>(fn: () => Result<T>): Result<T>
	static trySync<T>(fn: () => T): Result<T>
	static trySync<T>(
		fn: () => Promise<Result<T> | T> | Result<T> | T,
	): Promise<Result<T>> | Result<T> {
		try {
			const result = fn()
			if (Result.isPromise(result)) {
				return result
					.then((resolved) => (resolved instanceof Result ? resolved : Result.ok<T>(resolved)))
					.catch((e: any) => Result.fail<T>(e))
			}

			return result instanceof Result ? result : Result.ok<T>(result)
		} catch (e: any) {
			return Result.fail<T>(e)
		}
	}

	static combine(results: (Result<any> | null)[]): Result<any> {
		const errors = results.filter(Boolean).flatMap((r) => r!.errors)
		const combinedData = results.filter(Boolean).map((r) => r!.data)

		return errors.length > 0 ? Result.fail<any>(errors) : Result.ok<any>(combinedData)
	}

	static async combineAsync(results: Promise<Result<any>>[]): Promise<Result<any>> {
		return Result.combine(await Promise.all(results))
	}

	get isOk(): boolean {
		return this.errors.length === 0
	}

	get isFailure(): boolean {
		return this.errors.length > 0
	}

	get instance(): T {
		return this.data as T
	}

	get withFail(): Result<any> {
		return new Result<any>(undefined, this.errors)
	}

	get validator(): ResultValidator<T, Result<T>> {
		return new ResultValidator<T, Result<T>>(this)
	}

	toString(): string {
		return this.isOk
			? `Result.ok(${JSON.stringify(this.data)})`
			: `Result.fail(${JSON.stringify(this.errors)})`
	}

	private static getErrors(data: ErrorMsg | ErrorMsg[]): Message[] {
		const input: any = data
		if (Array.isArray(input)) {
			return input.flatMap((f) => Result.getItem(f))
		} else {
			return [...Result.getItem(input)]
		}
	}

	private static getItem(data: ErrorMsg): Message[] {
		const input: any = data
		if (input instanceof ValidationError) {
			return input.messages
		} else if (input?.["code"]) {
			return [input]
		} else if (input?.["message"]) {
			return [{ code: input?.["message"] }]
		} else if (typeof input === "string") {
			return [{ code: input }]
		} else {
			return [{ code: "error.unknown" }]
		}
	}

	private static isPromise<T>(value: unknown): value is Promise<T> {
		return !!value && typeof (value as Promise<T>).then === "function"
	}
}
