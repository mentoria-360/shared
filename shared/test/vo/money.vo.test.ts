import { Money } from '../../src';

describe('Money', () => {
  test('should create valid money with rounded amount', () => {
    const result = Money.tryCreate({
      amount: 10.129,
      currency: { code: ' brl ', symbol: ' R$ ', countryCode: ' br ', name: ' Real Brasileiro ' },
    });

    expect(result.isOk).toBe(true);
    expect(result.instance.amount).toBe(10.13);
    expect(result.instance.currency.code).toBe('BRL');
    expect(result.instance.currency.symbol).toBe('R$');
    expect(result.instance.currency.countryCode).toBe('BR');
    expect(result.instance.currency.name).toBe('Real Brasileiro');
  });

  test('should expose cents based on normalized amount', () => {
    const money = Money.create({
      amount: 12.345,
      currency: { code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' },
    });

    expect(money.amount).toBe(12.35);
    expect(money.cents).toBe(1235);
  });

  test('should format money using locale and currency code', () => {
    const money = Money.create({
      amount: 1234.5,
      currency: { code: 'BRL', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' },
    });

    expect(money.format()).toBe('R$ 1.234,50');
    expect(money.format({ locale: 'en-US' })).toBe('R$1,234.50');
  });

  test('should format with symbol and code helpers', () => {
    const money = Money.create({
      amount: 25,
      currency: { code: 'EUR', symbol: '€', countryCode: 'EU', name: 'Euro' },
    });

    expect(money.formatWithSymbol()).toBe('€ 25.00');
    expect(money.formatWithCode()).toBe('EUR 25.00');
  });

  test('should fail when amount is invalid', () => {
    const result = Money.tryCreate({
      amount: Number.NaN,
      currency: { code: 'BRL', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' },
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_MONEY_AMOUNT');
  });

  test('should fail when amount is negative', () => {
    const result = Money.tryCreate({
      amount: -10,
      currency: { code: 'BRL', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' },
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_MONEY_AMOUNT');
  });

  test('should fail when currency is invalid', () => {
    const result = Money.tryCreate({
      amount: 10,
      currency: { code: 'REAL', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' },
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_CODE');
  });

  test('should throw when create receives invalid money', () => {
    expect(() =>
      Money.create({
        amount: Number.POSITIVE_INFINITY,
        currency: { code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' },
      }),
    ).toThrow('INVALID_MONEY_AMOUNT');
  });

  test('should throw when create receives negative money', () => {
    expect(() =>
      Money.create({
        amount: -1,
        currency: { code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' },
      }),
    ).toThrow('INVALID_MONEY_AMOUNT');
  });
});
