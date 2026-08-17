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

export class Password extends ValueObject<string, ValueObjectConfig> {
  private static readonly EMPTY_PASSWORD = 'PASSWORD_EMPTY';

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
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
