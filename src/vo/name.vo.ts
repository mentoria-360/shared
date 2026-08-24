import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../errors/validation-error';
import { SharedErrors } from '../errors';

export interface NameProps extends ValueObjectConfig {}
export class Name extends ValueObject<string, NameProps> {
  public static readonly TOO_SHORT: string = SharedErrors.NAME_TOO_SHORT;
  public static readonly TOO_LONG: string = SharedErrors.NAME_TOO_LONG;
  public static readonly DEFAULT_MIN_LENGTH: number = 2;
  public static readonly DEFAULT_MAX_LENGTH: number = 100;

  constructor(value: string, config?: NameProps) {
    super(value, config);
  }

  public static create<T extends Name = Name>(
    value: string,
    config?: NameProps,
  ): T {
    const result = this.tryCreate(value, config) as Result<T>;
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate<T extends Name = Name>(
    value: string | null | undefined,
    config: OptionalConfig<NameProps>,
  ): Result<T | null>;
  public static tryCreate<T extends Name = Name>(
    value: string,
    config?: Metadata | NameProps,
  ): Result<T>;
  public static tryCreate<T extends Name = Name>(
    value: string | null | undefined,
    config?: NameProps,
  ): Result<T | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<T | null>(null);
    }
    try {
      const cls = this as any;
      const trimmedValue = value?.trim() ?? '';

      if (trimmedValue.length < cls.DEFAULT_MIN_LENGTH) {
        throw new ValidationError({ code: cls.TOO_SHORT });
      }

      if (trimmedValue.length > cls.DEFAULT_MAX_LENGTH) {
        throw new ValidationError({ code: cls.TOO_LONG });
      }

      return Result.ok(new cls(trimmedValue, resolveVoConfig(config)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
