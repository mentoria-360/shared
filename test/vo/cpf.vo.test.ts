import { Cpf } from '../../src';

describe('Cpf', () => {
  test('should create with masked cpf and store only digits', () => {
    const result = Cpf.tryCreate('529.982.247-25');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('52998224725');
  });

  test('should create with unmasked cpf', () => {
    const result = Cpf.tryCreate('52998224725');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('52998224725');
  });

  test('should accept cpf with partial mask', () => {
    const result = Cpf.tryCreate('529982247-25');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('52998224725');
  });

  test('should accept cpf separated by spaces', () => {
    const result = Cpf.tryCreate('529 982 247 25');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('52998224725');
  });

  test('should fail when cpf has a letter appended', () => {
    const result = Cpf.tryCreate('529.982.247-25x');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_FORMAT);
  });

  test('should fail when cpf carries a trailing annotation', () => {
    const result = Cpf.tryCreate('529.982.247-25 (pai)');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_FORMAT);
  });

  test('should fail when cpf has fewer than eleven digits', () => {
    const result = Cpf.tryCreate('5299822472');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_LENGTH);
  });

  test('should fail when value is a masked cnpj', () => {
    const result = Cpf.tryCreate('12.345.678/0001-95');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_FORMAT);
  });

  test('should fail when value is an unmasked cnpj', () => {
    const result = Cpf.tryCreate('12345678000195');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_LENGTH);
  });

  test('should fail when value carries a plus sign', () => {
    const result = Cpf.tryCreate('529.982.247-25+');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_FORMAT);
  });

  test('should fail when value carries parentheses', () => {
    const result = Cpf.tryCreate('(529) 982.247-25');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_FORMAT);
  });

  test('should fail when every digit is the same', () => {
    const result = Cpf.tryCreate('111.111.111-11');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.REPEATED_SEQUENCE);
  });

  test('should still reject a repeated sequence when check digit is disabled', () => {
    const result = Cpf.tryCreate('111.111.111-11', { checkDigit: false });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.REPEATED_SEQUENCE);
  });

  test('should fail when the check digit does not match', () => {
    const result = Cpf.tryCreate('529.982.247-24');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_CHECK_DIGIT);
  });

  test('should accept a wrong check digit when check digit is disabled', () => {
    const result = Cpf.tryCreate('529.982.247-24', { checkDigit: false });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('52998224724');
  });

  test('should expose the masked representation', () => {
    const cpf = Cpf.create('52998224725');

    expect(cpf.formatted).toBe('529.982.247-25');
  });

  test('should return null when value is null and config is optional', () => {
    const result = Cpf.tryCreate(null, { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });

  test('should return null when value is blank and config is optional', () => {
    const result = Cpf.tryCreate('   ', { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });

  test('should fail when value is empty and config is not optional', () => {
    const result = Cpf.tryCreate('', {});

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Cpf.INVALID_FORMAT);
  });

  test('should throw when create receives an invalid cpf', () => {
    expect(() => Cpf.create('123')).toThrow();
  });
});
