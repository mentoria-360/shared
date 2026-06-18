import { Entity } from '../base/entity';
import { Result } from '../base/result';
import { TransactionContext } from './transaction.manager';

export interface UpdateRepository<T extends Entity<any, any>> {
  update(entity: T, tx?: TransactionContext): Promise<Result<void>>;
}
