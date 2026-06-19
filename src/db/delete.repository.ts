import Result from "../base/result"

export interface DeleteRepository {
	delete(id: string): Promise<Result<void>>
}
