import { Result, StrongPassword } from "../../src"

test("Deve criar um novo 'Result' com valor", () => {
	const result = Result.ok(10)
	expect(result.data).toBe(10)
	expect(result.errors).toHaveLength(0)
	expect(result.isFailure).toBeFalsy()
	expect(result.isOk).toBeTruthy()
})

test("Deve criar um novo 'Result' com valor nulo", () => {
	const result = Result.null()
	expect(result.data).toBeNull()
	expect(result.errors).toHaveLength(0)
	expect(result.isFailure).toBeFalsy()
	expect(result.isOk).toBeTruthy()
})

test("Deve criar um novo 'Result' com falha", () => {
	const result = Result.fail("user.not-found")
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(1)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve criar um novo 'Result' com falha a partir de um erro", () => {
	const result = Result.fail(new Error("user.not-found"))
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(1)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve criar um novo 'Result' com vários tipos de falha", () => {
	const result = Result.fail([
		{ code: "user.not-found" },
		"user.not-authorized",
		{ message: "user.not-logged" },
		{ error: "user.not-logged" } as any,
	])
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(4)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve criar um novo 'Result' com falhas", () => {
	const result = Result.fail(["user.not-found", "user.not-authorized"])
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(2)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve criar um novo 'Result' com tentativa com falha", () => {
	const result = Result.try(() => new StrongPassword("123"))
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(1)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve criar um 'Result' com tentativa com sucesso", () => {
	const result = Result.try(() => new StrongPassword("#Senha123"))
	expect(result.data).toBeInstanceOf(StrongPassword)
	expect(result.errors).toHaveLength(0)
	expect(result.isFailure).toBeFalsy()
	expect(result.isOk).toBeTruthy()
})

test("Deve combinar 'Result' com sucessos e falhas", () => {
	const results = [Result.ok(10), Result.fail("user.not-found")]
	const result = Result.combine(results)
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(1)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve combinar 'Result' com sucesso", () => {
	const results = [Result.ok(10), Result.ok(20)]
	const result = Result.combine(results)
	expect(result.data).toHaveLength(2)
	expect(result.errors).toHaveLength(0)
	expect(result.isFailure).toBeFalsy()
	expect(result.isOk).toBeTruthy()
})

test("Deve combinar 'Result' com falha", () => {
	const results = [Result.fail("user.not-found"), Result.fail("user.not-authorized")]
	const result = Result.combine(results)
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(2)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve criar um 'Result' com promise com sucesso", async () => {
	const result = await Result.trySync(() => Promise.resolve(10))
	expect(result.data).toBe(10)
})

test("Deve criar um 'Result' com promise com falha", async () => {
	const result = await Result.trySync(() => Promise.reject(new Error("user.not-found")))
	expect(result.data).toBeUndefined()
	expect(result.errors).toHaveLength(1)
	expect(result.isFailure).toBeTruthy()
	expect(result.isOk).toBeFalsy()
})

test("Deve combinar 'Result' com promises com sucesso", async () => {
	const results = [Promise.resolve(Result.ok(10)), Promise.resolve(Result.ok(20))]
	const result = await Result.combineAsync(results)
	expect(result.data).toHaveLength(2)
	expect(result.errors).toHaveLength(0)
	expect(result.isFailure).toBeFalsy()
	expect(result.isOk).toBeTruthy()
})

describe("Result - API", () => {
	test("isOk should return true on success", () => {
		const result = Result.ok("hello")
		expect(result.isOk).toBe(true)
		expect(result.isFailure).toBe(false)
	})

	test("isFailure should return true on failure", () => {
		const result = Result.fail("error")
		expect(result.isOk).toBe(false)
		expect(result.isFailure).toBe(true)
	})

	test("instance should return data value", () => {
		const result = Result.ok("hello")
		expect(result.instance).toBe("hello")
	})

	test("withFail should propagate failure as Result<any>", () => {
		const result = Result.fail<string>("SOME_ERROR")
		const propagated: Result<number> = result.withFail

		expect(propagated.errors).toHaveLength(1)
		expect(propagated.isFailure).toBe(true)
		expect(propagated.errors[0]?.code).toBe("SOME_ERROR")
	})
})
