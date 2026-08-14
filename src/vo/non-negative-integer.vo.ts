import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { ValidationError } from '../base/validation-error';

export interface NonNegativeIntegerConfig extends ValueObjectConfig {
  errorCode?: string;
}

export class NonNegativeInteger extends ValueObject<number, NonNegativeIntegerConfig> {
  private static readonly INVALID = 'NON_NEGATIVE_INTEGER_INVALID';

  constructor(value: number, config?: NonNegativeIntegerConfig) {
    super(value, config);
  }

  public static create(
    value: number,
    config?: NonNegativeIntegerConfig,
  ): NonNegativeInteger {
    const result = NonNegativeInteger.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<NonNegativeIntegerConfig>,
  ): Result<NonNegativeInteger | null>;
  public static tryCreate(
    value: number,
    config?: NonNegativeIntegerConfig,
  ): Result<NonNegativeInteger>;
  public static tryCreate(
    value: number | null | undefined,
    config?: NonNegativeIntegerConfig,
  ): Result<NonNegativeInteger | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<NonNegativeInteger | null>(null);
    }
    try {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value) ||
        value < 0
      ) {
        throw new ValidationError({
          code: config?.errorCode ?? NonNegativeInteger.INVALID,
        });
      }

      return Result.ok(
        new NonNegativeInteger(value, resolveVoConfig(config) as NonNegativeIntegerConfig),
      );
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
