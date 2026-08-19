import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';
import { SharedErrors } from '../errors';

export class DayOfMonth extends ValueObject<number, ValueObjectConfig> {
  private static readonly INVALID_DAY_OF_MONTH =
    SharedErrors.DAY_OF_MONTH_INVALID;
  private static readonly OUT_OF_RANGE = SharedErrors.DAY_OF_MONTH_OUT_OF_RANGE;

  constructor(value: number, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(
    value: number,
    metaOrConfig?: ValueObjectConfig,
  ): DayOfMonth {
    const result = DayOfMonth.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<DayOfMonth | null>;
  public static tryCreate(
    value: number,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<DayOfMonth>;
  public static tryCreate(
    value: number | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<DayOfMonth | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<DayOfMonth | null>(null);
    }
    try {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value)
      ) {
        throw new ValidationError({ code: DayOfMonth.INVALID_DAY_OF_MONTH });
      }

      if (value < 1 || value > 31) {
        throw new ValidationError({ code: DayOfMonth.OUT_OF_RANGE });
      }

      return Result.ok(new DayOfMonth(value, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
