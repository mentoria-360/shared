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

export class PositiveInteger extends ValueObject<number, ValueObjectConfig> {
  private static readonly INVALID_POSITIVE_INTEGER = 'POSITIVE_INTEGER_INVALID';

  constructor(value: number, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(
    value: number,
    metaOrConfig?: ValueObjectConfig,
  ): PositiveInteger {
    const result = PositiveInteger.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<PositiveInteger | null>;
  public static tryCreate(
    value: number,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<PositiveInteger>;
  public static tryCreate(
    value: number | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<PositiveInteger | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<PositiveInteger | null>(null);
    }
    try {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value) ||
        value < 1
      ) {
        throw new ValidationError({
          code: PositiveInteger.INVALID_POSITIVE_INTEGER,
        });
      }

      return Result.ok(
        new PositiveInteger(value, resolveVoConfig(metaOrConfig)),
      );
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
