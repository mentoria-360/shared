import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class DayOfMonth extends ValueObject<number, ValueObjectConfig> {
  constructor(value: number, config?: ValueObjectConfig) {
    DayOfMonth.ensureValid(value);
    super(value, config);
  }

  public static create(value: number, metaOrConfig?: Metadata | ValueObjectConfig): DayOfMonth {
    const result = DayOfMonth.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: number, metaOrConfig?: Metadata | ValueObjectConfig): Result<DayOfMonth> {
    return Result.try(() => new DayOfMonth(value, resolveVoConfig(metaOrConfig)));
  }

  private static ensureValid(value: number): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
      throw new ValidationError({ code: 'day-of-month.invalid' });
    }

    if (value < 1 || value > 31) {
      throw new ValidationError({ code: 'day-of-month.out-of-range' });
    }
  }
}
