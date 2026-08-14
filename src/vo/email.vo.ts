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

export class Email extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_EMAIL = 'INVALID_EMAIL';
  static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  get local(): string {
    return this.value.split('@')?.[0] ?? '';
  }

  get username(): string {
    return this.local;
  }

  get domain(): string {
    return this.value.split('@')?.[1] ?? '';
  }

  public static create(value: string, metaOrConfig?: ValueObjectConfig): Email {
    const result = Email.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Email | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Email>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Email | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Email | null>(null);
    }
    try {
      const email = value?.trim().toLowerCase();

      if (!Email.EMAIL_REGEX.test(email ?? '')) {
        throw new ValidationError({ code: Email.INVALID_EMAIL });
      }

      return Result.ok(new Email(email ?? '', resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
