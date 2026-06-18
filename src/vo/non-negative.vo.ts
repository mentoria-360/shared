import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class NonNegative extends ValueObject<number, ValueObjectConfig> {
  constructor(value: number, config?: ValueObjectConfig) {
    if (value < 0) {
      throw new ValidationError({
        code: 'non-negative.invalid',
        meta: config?.meta ? { ...config.meta, value } : { value },
      });
    }

    super(value, config);
  }

  public static create(value: number, metaOrConfig?: Metadata | ValueObjectConfig): NonNegative {
    const result = NonNegative.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: number, metaOrConfig?: Metadata | ValueObjectConfig): Result<NonNegative> {
    return Result.try(() => new NonNegative(value, resolveVoConfig(metaOrConfig)));
  }
}
