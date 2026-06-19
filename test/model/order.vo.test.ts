import { Order, ValidationError } from "../../src"

test("Deve criar um Order com valores válidos", () => {
	expect(new Order(0).value).toBe(0)
	expect(new Order(5).value).toBe(5)
	expect(new Order(100).value).toBe(100)
})

test("Deve lançar ValidationError para valores negativos", () => {
	expect(() => new Order(-1)).toThrow(ValidationError)
	expect(() => new Order(-10)).toThrow(ValidationError)
	expect(() => new Order(-99.99)).toThrow(ValidationError)
})

test("Deve ordenar corretamente uma lista de objetos pelo order", () => {
	const items = [
		{ id: 1, order: new Order(3) },
		{ id: 2, order: new Order(1) },
		{ id: 3, order: new Order(2) },
	]

	const sortedItems = Order.sort(items)

	expect(sortedItems.map((item) => item.id)).toEqual([2, 3, 1])
})

test("Deve ordenar corretamente uma lista de objetos com números diretos", () => {
	const items = [
		{ id: 1, order: 10 },
		{ id: 2, order: 5 },
		{ id: 3, order: 7 },
	]

	const sortedItems = Order.sort(items)

	expect(sortedItems.map((item) => item.id)).toEqual([2, 3, 1])
})

test("Deve ordenar corretamente uma lista com instâncias de Order e números diretos", () => {
	const items = [
		{ id: 1, order: new Order(3) },
		{ id: 2, order: 2 },
		{ id: 3, order: new Order(1) },
		{ id: 4, order: 4 },
	]

	const sortedItems = Order.sort(items)

	expect(sortedItems.map((item) => item.id)).toEqual([3, 2, 1, 4])
})

test("Deve tentar criar uma ordem com sucesso", () => {
	const order = Order.tryCreate(10)
	expect(order.isOk).toBe(true)
})

test("Deve tentar criar uma ordem inválida", () => {
	const order = Order.tryCreate(-10)
	expect(order.isOk).toBe(false)
	expect(order.errors[0]?.code).toBe("order.negative")
})
