import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../errors/validation-error';
import { SharedErrors } from '../errors';

export interface PositiveIntegerConfig extends ValueObjectConfig {
  min?: number;
}

export class PositiveInteger extends ValueObject<
  number,
  PositiveIntegerConfig
> {
  private static readonly INVALID_POSITIVE_INTEGER =
    SharedErrors.POSITIVE_INTEGER_INVALID;
  public static readonly DEFAULT_MIN = 1;

  constructor(value: number, config?: PositiveIntegerConfig) {
    super(value, config);
  }

  public static create(
    value: number,
    metaOrConfig?: PositiveIntegerConfig,
  ): PositiveInteger {
    const result = PositiveInteger.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<PositiveIntegerConfig>,
  ): Result<PositiveInteger | null>;
  public static tryCreate(
    value: number,
    metaOrConfig?: Metadata | PositiveIntegerConfig,
  ): Result<PositiveInteger>;
  public static tryCreate(
    value: number | null | undefined,
    metaOrConfig?: PositiveIntegerConfig,
  ): Result<PositiveInteger | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<PositiveInteger | null>(null);
    }
    try {
      const min = metaOrConfig?.min ?? PositiveInteger.DEFAULT_MIN;
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value) ||
        value < min
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
