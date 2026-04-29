import { Result } from '../base';
import { TransactionContext } from '../db/transaction.manager';
import { DomainEvent } from './domain-event';

export interface DomainEventRepository {
  append(events: DomainEvent[], tx?: TransactionContext): Promise<Result<void>>;
}
