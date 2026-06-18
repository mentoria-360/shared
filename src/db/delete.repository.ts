import { Result } from '../base/result';
import { TransactionContext } from './transaction.manager';

export interface DeleteRepository {
  delete(id: string, tx?: TransactionContext): Promise<Result<void>>;
}
