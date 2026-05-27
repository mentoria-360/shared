import { Currency } from '../../src';

describe('Currency', () => {
  test('should create currency by code string using currencies data', () => {
    const result = Currency.tryCreate(' brl ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toEqual({
      code: 'BRL',
      symbol: 'R$',
      countryCode: 'BR',
      name: 'Real Brasileiro',
    });
  });

  test('should create valid currency with normalized values', () => {
    const result = Currency.tryCreate({
      code: ' brl ',
      symbol: ' R$ ',
      countryCode: ' br ',
      name: ' Real Brasileiro ',
    });

    expect(result.isOk).toBe(true);
    expect(result.instance.code).toBe('BRL');
    expect(result.instance.symbol).toBe('R$');
    expect(result.instance.countryCode).toBe('BR');
    expect(result.instance.name).toBe('Real Brasileiro');
  });

  test('should expose frozen value object', () => {
    const currency = Currency.create({ code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' });

    expect(Object.isFrozen(currency.value)).toBe(true);
    expect(currency.value).toEqual({ code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' });
  });

  test('should create by code string with create method', () => {
    const currency = Currency.create('usd');

    expect(currency.value).toEqual({ code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' });
  });

  test('should fail when code is invalid', () => {
    const result = Currency.tryCreate({ code: 'real', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_CODE');
  });

  test('should fail when code string is not supported in currencies data', () => {
    const result = Currency.tryCreate('AAA');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_CODE');
  });

  test('should fail when code string format is invalid', () => {
    const result = Currency.tryCreate('u$');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_CODE');
  });

  test('should fail when code is missing', () => {
    const result = Currency.tryCreate({
      code: undefined as any,
      symbol: 'R$',
      countryCode: 'BR',
      name: 'Real Brasileiro',
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_CODE');
  });

  test('should fail when symbol is empty', () => {
    const result = Currency.tryCreate({ code: 'BRL', symbol: '   ', countryCode: 'BR', name: 'Real Brasileiro' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_SYMBOL');
  });

  test('should fail when country code is invalid', () => {
    const result = Currency.tryCreate({ code: 'BRL', symbol: 'R$', countryCode: 'BRA', name: 'Real Brasileiro' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_COUNTRY_CODE');
  });

  test('should fail when country code is missing', () => {
    const result = Currency.tryCreate({
      code: 'BRL',
      symbol: 'R$',
      countryCode: undefined as any,
      name: 'Real Brasileiro',
    });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_COUNTRY_CODE');
  });

  test('should fail when name is empty', () => {
    const result = Currency.tryCreate({ code: 'BRL', symbol: 'R$', countryCode: 'BR', name: '   ' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CURRENCY_NAME');
  });

  test('should throw when create receives invalid currency', () => {
    expect(() => Currency.create({ code: 'BR', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' })).toThrow(
      'INVALID_CURRENCY_CODE',
    );
  });
});
