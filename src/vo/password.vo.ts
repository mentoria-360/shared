import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class Password extends ValueObject<string, ValueObjectConfig> {
  constructor(value: string, config?: ValueObjectConfig) {
    if (!value?.trim()) {
      throw new ValidationError({
        code: 'password.empty',
        meta: { ...config?.meta, value: undefined },
      });
    }

    super(value, config);
  }

  public static create(value?: string, metaOrConfig?: Metadata | ValueObjectConfig): Password {
    const result = Password.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value?: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Password> {
    return Result.try(() => new Password(value ?? '', resolveVoConfig(metaOrConfig)));
  }
}
