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

export class Flag extends ValueObject<boolean, ValueObjectConfig> {
  private static readonly INVALID_FLAG = 'INVALID_FLAG';

  constructor(value: boolean, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: boolean, config?: ValueObjectConfig): Flag {
    const result = Flag.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: boolean | null | undefined,
    config: OptionalConfig,
  ): Result<Flag | null>;
  public static tryCreate(
    value: boolean,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Flag>;
  public static tryCreate(
    value: boolean | null | undefined,
    config?: ValueObjectConfig,
  ): Result<Flag | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<Flag | null>(null);
    }
    try {
      if (typeof value !== 'boolean') {
        throw new ValidationError({ code: Flag.INVALID_FLAG });
      }

      return Result.ok(new Flag(value, resolveVoConfig(config)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
