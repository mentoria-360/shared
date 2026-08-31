import {
  isEmptyValue,
  OptionalConfig,
  Result,
  ValueObject,
  ValueObjectConfig,
} from '../base';
import { SharedErrors } from '../errors';
import { ValidationError } from '../errors/validation-error';

export interface TextConfig extends ValueObjectConfig {
  minLength?: number;
  maxLength?: number;
}

export class Text extends ValueObject<string, TextConfig> {
  protected static readonly TOO_SHORT: string = SharedErrors.TEXT_TOO_SHORT;
  protected static readonly TOO_LONG: string = SharedErrors.TEXT_TOO_LONG;
  protected static readonly INVALID_TEXT: string = SharedErrors.TEXT_INVALID;
  protected static readonly DEFAULT_MIN_LENGTH: number = 1;
  protected static readonly DEFAULT_MAX_LENGTH = Number.MAX_SAFE_INTEGER;

  protected constructor(value: string, config?: TextConfig) {
    super(value, config);
  }

  public static create(value: string, config?: TextConfig): Text {
    const result = this.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    text: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<Text | null>;
  public static tryCreate(text: string, config?: TextConfig): Result<Text>;
  public static tryCreate(
    text: string | null | undefined,
    config?: TextConfig,
  ): Result<Text | null> {
    if (config?.optional && isEmptyValue(text)) {
      return Result.ok<Text | null>(null);
    }

    try {
      if (text != null && typeof text !== 'string') {
        throw new ValidationError({ code: this.INVALID_TEXT });
      }

      const value = text?.trim() ?? '';
      const min = config?.minLength ?? this.DEFAULT_MIN_LENGTH;
      const max = config?.maxLength ?? this.DEFAULT_MAX_LENGTH;

      if (value.length < min) {
        throw new ValidationError({ code: this.TOO_SHORT });
      }
      if (max && value.length > max) {
        throw new ValidationError({ code: this.TOO_LONG });
      }

      return Result.ok(new (this as any)(value, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
