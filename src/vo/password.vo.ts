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
export class Password extends ValueObject<string, ValueObjectConfig> {
  private static readonly EMPTY_PASSWORD = SharedErrors.PASSWORD_EMPTY;
  private static readonly HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static isHash(hash?: string): boolean {
    return Password.HASH_REGEX.test(hash?.trim() ?? '');
  }

  public static create(
    value?: string,
    metaOrConfig?: ValueObjectConfig,
  ): Password {
    const result = Password.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Password | null>;
  public static tryCreate(
    value?: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Password>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Password | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Password | null>(null);
    }
    try {
      if (!value?.trim()) {
        throw new ValidationError({ code: Password.EMPTY_PASSWORD });
      }

      return Result.ok(new Password(value, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
