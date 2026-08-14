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

export class HashPassword extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_HASH_PASSWORD = 'INVALID_HASH_PASSWORD';
  static readonly HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(
    value: string,
    metaOrConfig?: ValueObjectConfig,
  ): HashPassword {
    const result = HashPassword.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<HashPassword | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<HashPassword>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<HashPassword | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<HashPassword | null>(null);
    }

    try {
      const hash = value?.trim() ?? '';

      if (!HashPassword.HASH_REGEX.test(hash)) {
        throw new ValidationError({ code: HashPassword.INVALID_HASH_PASSWORD });
      }

      return Result.ok(new HashPassword(hash, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
