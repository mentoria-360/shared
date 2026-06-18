import { Entity } from '../base/entity';
import { Result } from '../base/result';

export interface FindByIdRepository<T extends Entity<any, any>> {
  findById(id: string): Promise<Result<T>>;
}
