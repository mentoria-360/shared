import { Result, ValueObject, ValueObjectConfig } from '../base';
import { currenciesData } from '../data/currencies.data';

export interface CurrencyProps {
  code: string;
  symbol: string;
  countryCode: string;
  name: string;
}

export type CurrencyInput = CurrencyProps | string;

export class Currency extends ValueObject<CurrencyProps, ValueObjectConfig> {
  private static readonly INVALID_CURRENCY_CODE = 'INVALID_CURRENCY_CODE';
  private static readonly INVALID_CURRENCY_SYMBOL = 'INVALID_CURRENCY_SYMBOL';
  private static readonly INVALID_CURRENCY_COUNTRY_CODE = 'INVALID_CURRENCY_COUNTRY_CODE';
  private static readonly INVALID_CURRENCY_NAME = 'INVALID_CURRENCY_NAME';

  private constructor(value: CurrencyProps, config?: ValueObjectConfig) {
    super(Object.freeze(value), config);
  }

  get code(): string {
    return this.value.code;
  }

  get symbol(): string {
    return this.value.symbol;
  }

  get countryCode(): string {
    return this.value.countryCode;
  }

  get name(): string {
    return this.value.name;
  }

  public static create(value: CurrencyInput, config?: ValueObjectConfig): Currency {
    const result = Currency.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: CurrencyInput, config?: ValueObjectConfig): Result<Currency> {
    try {
      const input = Currency.resolveInput(value);
      const code = input?.code?.trim().toUpperCase();
      const symbol = input?.symbol?.trim();
      const countryCode = input?.countryCode?.trim().toUpperCase();
      const name = input?.name?.trim();

      if (!/^[A-Z]{3}$/.test(code ?? '')) {
        throw new Error(Currency.INVALID_CURRENCY_CODE);
      }

      if (!symbol) {
        throw new Error(Currency.INVALID_CURRENCY_SYMBOL);
      }

      if (!/^[A-Z]{2}$/.test(countryCode ?? '')) {
        throw new Error(Currency.INVALID_CURRENCY_COUNTRY_CODE);
      }

      if (!name) {
        throw new Error(Currency.INVALID_CURRENCY_NAME);
      }

      return Result.ok(new Currency({ code, symbol, countryCode, name }, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static resolveInput(value: CurrencyInput): CurrencyProps {
    if (typeof value !== 'string') {
      return value;
    }

    const code = value.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(code)) {
      throw new Error(Currency.INVALID_CURRENCY_CODE);
    }

    const currency = currenciesData.find((item) => item.code === code);
    if (!currency) {
      throw new Error(Currency.INVALID_CURRENCY_CODE);
    }

    return currency;
  }
}
