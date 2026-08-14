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

export class Cpf extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_CPF = 'cpf.invalid';

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  get formatted(): string {
    return this.value;
  }

  get unformatted(): string {
    return Cpf.onlyNumbers(this.value);
  }

  public static isValid(cpf: string): boolean {
    if (!cpf) return false;
    const nums = cpf.split('').filter((v) => '0123456789'.includes(v));
    if (nums.length !== 11) return false;

    const v1 = this.validateCheckDigit(nums.slice(0, 9), nums[9]!);
    const v2 = this.validateCheckDigit(nums.slice(0, 10), nums[10]!);
    return v1 && v2;
  }

  public static create(value: string, metaOrConfig?: ValueObjectConfig): Cpf {
    const result = Cpf.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Cpf | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Cpf>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Cpf | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Cpf | null>(null);
    }
    try {
      const numbers = Cpf.onlyNumbers(value ?? '');

      if (!Cpf.isValid(numbers)) {
        throw new ValidationError({ code: Cpf.INVALID_CPF });
      }

      return Result.ok(new Cpf(Cpf.format(numbers), resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  static format(v: string) {
    const numbers = Cpf.onlyNumbers(v).split('');
    return numbers.reduce((cpf, num) => {
      const dot = [3, 7].includes(cpf.length) ? '.' : '';
      const dash = [11].includes(cpf.length) ? '-' : '';
      return `${cpf}${dot}${dash}${num}`;
    }, '');
  }

  private static onlyNumbers(cpf: string): string {
    return cpf
      .split('')
      .filter((v) => '0123456789'.includes(v))
      .filter((_, i) => i < 11)
      .join('');
  }

  private static validateCheckDigit(digits: string[], providedDigit: string) {
    const total = digits.reduce((sum, digit, index) => {
      const factor = digits.length + 1 - index;
      return sum + +digit * factor;
    }, 0);

    const remainder = total % 11;
    const calculatedDigit = remainder < 2 ? 0 : 11 - remainder;
    return calculatedDigit === +providedDigit;
  }
}
