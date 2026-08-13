import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class StrongPassword extends ValueObject<string, ValueObjectConfig> {
  constructor(value?: string, config?: ValueObjectConfig) {
    if (!StrongPassword.isStrong(value)) {
      throw new ValidationError({ code: 'strong-password.too-weak' });
    }

    super(value as string, config);
  }

  public static isStrong(value?: string): boolean {
    if (!value || value.length < 8) return false;
    if (!/[A-Z]/.test(value)) return false;
    if (!/[a-z]/.test(value)) return false;
    if (!/[0-9]/.test(value)) return false;
    if (!/[^A-Za-z0-9]/.test(value)) return false;
    return true;
  }

  public static create(value: string, metaOrConfig?: Metadata | ValueObjectConfig): StrongPassword {
    const result = StrongPassword.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<StrongPassword | null>;
  public static tryCreate(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<StrongPassword>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: ValueObjectConfig): Result<StrongPassword | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<StrongPassword | null>(null);
    }

    return Result.try(() => new StrongPassword(value as string, resolveVoConfig(metaOrConfig)));
  }
}
