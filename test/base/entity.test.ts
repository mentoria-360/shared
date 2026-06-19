import { Entity, EntityProps, Id } from "../../src"

interface BasicEntityProps extends EntityProps {
	name?: string
	age?: number
}

class BasicEntity extends Entity<BasicEntity, BasicEntityProps> {
	constructor(props: BasicEntityProps) {
		super(props)
	}
}

test("Deve considerar entidades iguais quando possuem o mesmo ID", () => {
	const id = Id.createUUID()
	const entity1 = new BasicEntity({ id })
	const entity2 = new BasicEntity({ id })
	expect(entity1.equals(entity2)).toBeTruthy()
})

test("Deve considerar entidades diferentes quando possuem IDs diferentes", () => {
	const id1 = Id.createUUID()
	const id2 = Id.createUUID()
	const entity1 = new BasicEntity({ id: id1 })
	const entity2 = new BasicEntity({ id: id2 })
	expect(entity1.equals(entity2)).toBe(false)
	expect(entity1.notEquals(entity2)).toBe(true)
})

test("Deve clonar uma entidade e alterar apenas a idade", () => {
	const age = 30
	const entity = new BasicEntity({
		id: Id.createUUID(),
		name: "John Doe",
		age: 20,
	})

	const clone = entity.clone({ age }).instance
	expect(clone.id.value).toBe(entity.id.value)
	expect(clone.props.name).toBe(entity.props.name)
	expect(clone.props.age).toBe(age)
})

test("Deve clonar uma entidade e alterar apenas o nome", () => {
	const name = "Little Johnny"
	const entity = new BasicEntity({
		id: Id.createUUID(),
		name: "John Doe",
		age: 20,
	})

	const clone = entity.clone({ name }).instance
	expect(clone.id.value).toBe(entity.id.value)
	expect(clone.props.name).toBe(name)
	expect(clone.props.age).toBe(entity.props.age)
})

test("Deve clonar uma entidade e alterar apenas o id", () => {
	const id = Id.createUUID()
	const entity = new BasicEntity({
		id: Id.createUUID(),
		name: "John Doe",
		age: 20,
	})

	const clone = entity.clone({ id: id.value }).instance
	expect(entity.notEquals(clone)).toBe(true)
	expect(clone.id.value).toBe(id)
	expect(clone.props.name).toBe(entity.props.name)
	expect(clone.props.age).toBe(entity.props.age)
})

test("Deve criar uma entidade com 'createdAt' válido", () => {
	const entity = new BasicEntity({})

	expect(entity.createdAt).toBeInstanceOf(Date)
	expect(entity.createdAt).toBe(entity.props.createdAt)
})

test("Deve criar uma entidade com 'updatedAt' válido", () => {
	const entity = new BasicEntity({})

	expect(entity.updatedAt).toBeInstanceOf(Date)
	expect(entity.updatedAt).toBe(entity.props.updatedAt)
})

test("Deve criar uma entidade com 'deletedAt' nulo", () => {
	const entity = new BasicEntity({})
	expect(entity.deletedAt).toBe(null)
})

test("Deve manter 'createdAt' quando uma entidade for clonada", () => {
	const entity = new BasicEntity({})
	const clone = entity.clone({ name: "John Doe", age: 20 }).instance

	expect(clone.createdAt).toBeInstanceOf(Date)
	expect(clone.createdAt).toBe(entity.createdAt)
})

test("Deve atualizar 'updatedAt' quando uma entidade for clonada", () => {
	const entity = new BasicEntity({})
	const clone = entity.clone({ name: "John Doe", age: 20 }).instance

	expect(clone.updatedAt).toBeInstanceOf(Date)
	expect(clone.updatedAt).not.toBe(entity.updatedAt)
})

test("Deve marcar uma entidade como excluida", () => {
	const entity = new BasicEntity({
		id: Id.createUUID(),
		name: "John Doe",
		age: 20,
	})

	const deletedEntity = entity.markAsDeleted().instance
	expect(deletedEntity.deletedAt).toBeInstanceOf(Date)
})
