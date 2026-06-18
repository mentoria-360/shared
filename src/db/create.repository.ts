import { Entity } from '../base/entity';
import { Result } from '../base/result';
import { TransactionContext } from './transaction.manager';

export interface CreateRepository<T extends Entity<any, any>> {
  create(entity: T, tx?: TransactionContext): Promise<Result<void>>;
}
