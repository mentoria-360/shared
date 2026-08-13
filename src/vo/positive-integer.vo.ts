import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class PositiveInteger extends ValueObject<number, ValueObjectConfig> {
  constructor(value: number, config?: ValueObjectConfig) {
    PositiveInteger.ensureValid(value);
    super(value, config);
  }

  public static create(value: number, metaOrConfig?: Metadata | ValueObjectConfig): PositiveInteger {
    const result = PositiveInteger.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: number | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<PositiveInteger | null>;
  public static tryCreate(value: number, metaOrConfig?: Metadata | ValueObjectConfig): Result<PositiveInteger>;
  public static tryCreate(value: number | null | undefined, metaOrConfig?: ValueObjectConfig): Result<PositiveInteger | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<PositiveInteger | null>(null);
    }

    return Result.try(() => new PositiveInteger(value as number, resolveVoConfig(metaOrConfig)));
  }

  private static ensureValid(value: number): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
      throw new ValidationError({ code: 'positive-integer.invalid' });
    }
  }
}
