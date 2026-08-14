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
import { HashPassword } from './hash-password.vo';

export class EncryptedPassword extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_ENCRYPTED_PASSWORD = 'encrypted-password.invalid';

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static isValid(hash: string): boolean {
    return HashPassword.isValid(hash);
  }

  public static create(
    value?: string,
    metaOrConfig?: ValueObjectConfig,
  ): EncryptedPassword {
    const result = EncryptedPassword.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<EncryptedPassword | null>;
  public static tryCreate(
    value?: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<EncryptedPassword>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<EncryptedPassword | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<EncryptedPassword | null>(null);
    }
    try {
      const hash = value?.trim() ?? '';

      if (!HashPassword.isValid(hash)) {
        throw new ValidationError({
          code: EncryptedPassword.INVALID_ENCRYPTED_PASSWORD,
        });
      }

      return Result.ok(new EncryptedPassword(hash, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
