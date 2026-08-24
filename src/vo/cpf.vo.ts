import {
  isEmptyValue,
  OptionalConfig,
  Result,
  ValueObject,
  ValueObjectConfig,
} from '../base';
import { ValidationError } from '../errors/validation-error';
import { SharedErrors } from '../errors';

export interface CpfConfig extends ValueObjectConfig {
  checkDigit?: boolean;
}

export class Cpf extends ValueObject<string, CpfConfig> {
  public static readonly INVALID_FORMAT: string =
    SharedErrors.CPF_INVALID_FORMAT;
  public static readonly INVALID_LENGTH: string =
    SharedErrors.CPF_INVALID_LENGTH;
  public static readonly REPEATED_SEQUENCE: string =
    SharedErrors.CPF_REPEATED_SEQUENCE;
  public static readonly INVALID_CHECK_DIGIT: string =
    SharedErrors.CPF_INVALID_CHECK_DIGIT;

  private static readonly DIGIT_COUNT: number = 11;
  private static readonly MOD_11_BASE: number = 11;
  private static readonly ACCEPTED_CHARS: RegExp = /^[0-9.\- ]+$/;
  private static readonly NON_DIGIT: RegExp = /\D/g;

  private constructor(value: string, config?: CpfConfig) {
    super(value, config);
  }

  get formatted(): string {
    const value = this.value;
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
      6,
      9,
    )}-${value.slice(9, 11)}`;
  }

  public static create(value: string, config?: CpfConfig): Cpf {
    const result = Cpf.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<CpfConfig>,
  ): Result<Cpf | null>;
  public static tryCreate(value: string, config?: CpfConfig): Result<Cpf>;
  public static tryCreate(
    value: string | null | undefined,
    config?: CpfConfig,
  ): Result<Cpf | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<Cpf | null>(null);
    }

    try {
      if (typeof value !== 'string') {
        throw new ValidationError({ code: Cpf.INVALID_FORMAT });
      }

      const text = value.trim();
      if (!Cpf.ACCEPTED_CHARS.test(text)) {
        throw new ValidationError({ code: Cpf.INVALID_FORMAT });
      }

      const digits = text.replace(Cpf.NON_DIGIT, '');
      if (digits.length !== Cpf.DIGIT_COUNT) {
        throw new ValidationError({ code: Cpf.INVALID_LENGTH });
      }

      if (new Set(digits).size === 1) {
        throw new ValidationError({ code: Cpf.REPEATED_SEQUENCE });
      }

      if (config?.checkDigit !== false) {
        const first = Cpf.calculateCheckDigit(digits, 9);
        const second = Cpf.calculateCheckDigit(digits, 10);
        if (
          first !== Number(digits.charAt(9)) ||
          second !== Number(digits.charAt(10))
        ) {
          throw new ValidationError({ code: Cpf.INVALID_CHECK_DIGIT });
        }
      }

      return Result.ok(new Cpf(digits, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static calculateCheckDigit(digits: string, length: number): number {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(digits.charAt(i)) * (length + 1 - i);
    }
    const rest = (sum * 10) % Cpf.MOD_11_BASE;
    return rest === 10 ? 0 : rest;
  }
}
