import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { Metadata } from '../base/metadata';
import { SharedErrors } from '../errors';
export class Email extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_EMAIL = SharedErrors.EMAIL_INVALID;
  static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static isValid(value: string): boolean {
    return Email.EMAIL_REGEX.test(value?.trim().toLowerCase() ?? '');
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
        return Result.fail([Email.INVALID_EMAIL, Email.INVALID_EMAIL]);
      }

      return Result.ok(new Email(email ?? '', resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
