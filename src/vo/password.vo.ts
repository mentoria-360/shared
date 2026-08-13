import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
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

  public static tryCreate(value: string | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<Password | null>;
  public static tryCreate(value?: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Password>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: ValueObjectConfig): Result<Password | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Password | null>(null);
    }

    return Result.try(() => new Password((value ?? '') as string, resolveVoConfig(metaOrConfig)));
  }
}
