import { Result, ValueObject, ValueObjectConfig } from '../base';
import { Currency, CurrencyProps } from './currency.vo';

export interface MoneyProps {
  amount: number;
  currency: CurrencyProps;
}

export interface MoneyFormatOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

export class Money extends ValueObject<MoneyProps, ValueObjectConfig> {
  private static readonly INVALID_MONEY_AMOUNT = 'INVALID_MONEY_AMOUNT';

  private constructor(value: MoneyProps, config?: ValueObjectConfig) {
    super(
      Object.freeze({
        amount: value.amount,
        currency: Object.freeze({ ...value.currency }),
      }),
      config,
    );
  }

  get amount(): number {
    return this.value.amount;
  }

  get currency(): Currency {
    return Currency.create(this.value.currency, this.config);
  }

  get cents(): number {
    return Math.round(this.amount * 100);
  }

  public format(options?: MoneyFormatOptions): string {
    const { locale = 'pt-BR', ...numberOptions } = options ?? {};

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...numberOptions,
    }).format(this.amount);
  }

  public formatWithSymbol(): string {
    return `${this.currency.symbol} ${this.amount.toFixed(2)}`;
  }

  public formatWithCode(): string {
    return `${this.currency.code} ${this.amount.toFixed(2)}`;
  }

  public static create(value: MoneyProps, config?: ValueObjectConfig): Money {
    const result = Money.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: MoneyProps, config?: ValueObjectConfig): Result<Money> {
    try {
      const amount = Number(value?.amount);
      if (!Number.isFinite(amount)) {
        throw new Error(Money.INVALID_MONEY_AMOUNT);
      }

      if (amount < 0) {
        throw new Error(Money.INVALID_MONEY_AMOUNT);
      }

      const currencyResult = Currency.tryCreate(value?.currency, config);
      currencyResult.validator.throwsIfFailed();

      const normalizedAmount = Math.round(amount * 100) / 100;
      return Result.ok(
        new Money(
          {
            amount: normalizedAmount,
            currency: currencyResult.instance.value,
          },
          config,
        ),
      );
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
