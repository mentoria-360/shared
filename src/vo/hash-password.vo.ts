import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class HashPassword extends ValueObject<string, ValueObjectConfig> {
  static readonly HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

  constructor(value: string, config?: ValueObjectConfig) {
    const hash = value?.trim() ?? '';
    if (!HashPassword.isValid(hash)) {
      throw new ValidationError({ code: 'hash-password.invalid' });
    }

    super(hash, config);
  }

  public static isValid(hash: string): boolean {
    return HashPassword.HASH_REGEX.test(hash?.trim() ?? '');
  }

  public static create(value: string, metaOrConfig?: Metadata | ValueObjectConfig): HashPassword {
    const result = HashPassword.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<HashPassword> {
    return Result.try(() => new HashPassword(value, resolveVoConfig(metaOrConfig)));
  }
}
