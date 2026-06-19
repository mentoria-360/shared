import Entity from "../base/entity"
import Result from "../base/result"

export interface UpdateRepository<T extends Entity<any, any>> {
	update(entity: T): Promise<Result<void>>
}
