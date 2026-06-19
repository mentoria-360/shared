import Entity from "../base/entity"
import Result from "../base/result"

export interface CreateRepository<T extends Entity<any, any>> {
	create(entity: T): Promise<Result<void>>
}
