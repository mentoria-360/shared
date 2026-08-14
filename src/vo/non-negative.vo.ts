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

export class NonNegative extends ValueObject<number, ValueObjectConfig> {
  private static readonly INVALID_NON_NEGATIVE = 'non-negative.invalid';

  constructor(value: number, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(
    value: number,
    metaOrConfig?: ValueObjectConfig,
  ): NonNegative {
    const result = NonNegative.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<NonNegative | null>;
  public static tryCreate(
    value: number,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<NonNegative>;
  public static tryCreate(
    value: number | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<NonNegative | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<NonNegative | null>(null);
    }
    try {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < 0
      ) {
        throw new ValidationError({ code: NonNegative.INVALID_NON_NEGATIVE });
      }

      return Result.ok(
        new NonNegative(value as number, resolveVoConfig(metaOrConfig)),
      );
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
