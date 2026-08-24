import {
  isEmptyValue,
  OptionalConfig,
  Result,
  ValueObject,
  ValueObjectConfig,
} from '../base';
import { ValidationError } from '../errors/validation-error';
import { SharedErrors } from '../errors';
export class Phone extends ValueObject<string, ValueObjectConfig> {
  public static readonly INVALID_FORMAT: string =
    SharedErrors.PHONE_INVALID_FORMAT;
  public static readonly INVALID_LENGTH: string =
    SharedErrors.PHONE_INVALID_LENGTH;

  private static readonly MIN_DIGITS = 8;
  private static readonly MAX_DIGITS = 15;
  private static readonly ACCEPTED_CHARS: RegExp = /^\+?[0-9.\-\/ ()]+$/;
  private static readonly NON_DIGIT: RegExp = /\D/g;

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): Phone {
    const result = Phone.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig,
  ): Result<Phone | null>;
  public static tryCreate(
    value: string,
    config?: ValueObjectConfig,
  ): Result<Phone>;
  public static tryCreate(
    value: string | null | undefined,
    config?: ValueObjectConfig,
  ): Result<Phone | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<Phone | null>(null);
    }

    try {
      if (typeof value !== 'string') {
        throw new ValidationError({ code: Phone.INVALID_FORMAT });
      }

      const text = value.trim();
      if (!Phone.ACCEPTED_CHARS.test(text)) {
        throw new ValidationError({ code: Phone.INVALID_FORMAT });
      }

      const digits = text.replace(Phone.NON_DIGIT, '');
      if (
        digits.length < Phone.MIN_DIGITS ||
        digits.length > Phone.MAX_DIGITS
      ) {
        throw new ValidationError({ code: Phone.INVALID_LENGTH });
      }

      return Result.ok(new Phone(digits, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
