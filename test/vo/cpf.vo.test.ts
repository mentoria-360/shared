import { Cpf } from '../../src';

describe('Cpf', () => {
  test('should format and expose value', () => {
    const cpf = new Cpf('12345678909');
    expect(cpf.formatted).toBe('123.456.789-09');
    expect(cpf.value).toBe('123.456.789-09');
  });

  test('should throw when cpf is invalid', () => {
    expect(() => new Cpf('12345678900')).toThrow('cpf.invalid');
  });

  test('should expose unformatted digits', () => {
    const cpf = new Cpf('123.456.789-09');
    expect(cpf.unformatted).toBe('12345678909');
  });

  test('should validate cpf with isValid', () => {
    expect(Cpf.isValid(null as any)).toBe(false);
    expect(Cpf.isValid('')).toBe(false);
    expect(Cpf.isValid('123')).toBe(false);
    expect(Cpf.isValid('12345678909')).toBe(true);
  });

  test('should create valid cpf via create', () => {
    const cpf = Cpf.create('12345678909');
    expect(cpf.formatted).toBe('123.456.789-09');
  });

  test('should throw via create when cpf is invalid', () => {
    expect(() => Cpf.create('12345678900')).toThrow();
  });

  test('should tryCreate valid cpf', () => {
    const cpf = Cpf.tryCreate('12345678909');
    expect(cpf.isOk).toBe(true);
  });

  test('should tryCreate invalid cpf', () => {
    const cpf = Cpf.tryCreate('12345678900');
    expect(cpf.isOk).toBe(false);
    expect(cpf.errors[0]).toBe('cpf.invalid');
  });
});
