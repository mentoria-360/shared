import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class Email extends ValueObject<string, ValueObjectConfig> {
  constructor(value: string, config?: ValueObjectConfig) {
    const email = value?.trim().toLowerCase();
    if (!Email.isValid(email)) {
      throw new ValidationError({ code: 'email.invalid' });
    }

    super(email, config);
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

  public static create(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Email {
    const result = Email.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Email> {
    return Result.try(() => new Email(value, resolveVoConfig(metaOrConfig)));
  }

  public static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }
}
