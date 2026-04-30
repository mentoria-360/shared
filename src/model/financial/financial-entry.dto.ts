import { MoneyProps } from '../../vo';
import { FinancialDirection } from './financial-direction.enum';
import { FinancialRecordStatus } from './financial-record-status.enum';

export enum FinancialEntryType {
  TRANSACTION = 'TRANSACTION',
  SCHEDULED_TRANSACTION = 'SCHEDULED_TRANSACTION',
}

export interface FinancialEntryDTO {
  id: string;
  type: FinancialEntryType;
  sourceId?: string | null;
  sequenceNumber?: number | null;
  description: string;
  value: MoneyProps;
  direction: FinancialDirection;
  status: FinancialRecordStatus;
  entryOn: string;
  accountId?: string | null;
  creditCardId?: string | null;
  subcategoryId?: string | null;
}
