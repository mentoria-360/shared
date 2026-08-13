import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
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

  public static tryCreate(value: number | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<DayOfMonth | null>;
  public static tryCreate(value: number, metaOrConfig?: Metadata | ValueObjectConfig): Result<DayOfMonth>;
  public static tryCreate(value: number | null | undefined, metaOrConfig?: ValueObjectConfig): Result<DayOfMonth | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<DayOfMonth | null>(null);
    }

    return Result.try(() => new DayOfMonth(value as number, resolveVoConfig(metaOrConfig)));
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
