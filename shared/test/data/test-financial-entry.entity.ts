import { FinancialEntry, FinancialEntryProps } from '../../src';

export interface TestFinancialEntryProps extends FinancialEntryProps {
  kind?: 'income' | 'expense';
}

export class TestFinancialEntry extends FinancialEntry<TestFinancialEntry, TestFinancialEntryProps> {
  protected constructor(props: TestFinancialEntryProps) {
    super(props);
  }

  get kind(): 'income' | 'expense' {
    return this.props.kind ?? 'expense';
  }
}
