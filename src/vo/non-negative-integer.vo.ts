import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig } from '../base/vo';

export interface NonNegativeIntegerConfig extends ValueObjectConfig {
  errorCode?: string;
}

export class NonNegativeInteger extends ValueObject<number, NonNegativeIntegerConfig> {
  public static readonly INVALID = 'NON_NEGATIVE_INTEGER_INVALID';

  private constructor(value: number, config?: NonNegativeIntegerConfig) {
    super(value, config);
  }

  public static create(value: number, config?: NonNegativeIntegerConfig): NonNegativeInteger {
    const result = NonNegativeInteger.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<NonNegativeIntegerConfig>,
  ): Result<NonNegativeInteger | null>;
  public static tryCreate(value: number, config?: NonNegativeIntegerConfig): Result<NonNegativeInteger>;
  public static tryCreate(
    value: number | null | undefined,
    config?: NonNegativeIntegerConfig,
  ): Result<NonNegativeInteger | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<NonNegativeInteger | null>(null);
    }

    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      return Result.fail(config?.errorCode ?? NonNegativeInteger.INVALID);
    }

    return Result.ok(new NonNegativeInteger(value, config));
  }
}
