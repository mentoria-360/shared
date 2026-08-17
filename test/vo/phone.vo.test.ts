import { Phone } from '../../src';

describe('Phone', () => {
  test('should keep the country code that came with the value', () => {
    const result = Phone.tryCreate('+55 (11) 9 1234-5678');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('5511912345678');
  });

  test('should not add a country code that did not come with the value', () => {
    const result = Phone.tryCreate('(11) 91234-5678');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('11912345678');
  });

  test('should be idempotent over an already normalized value', () => {
    const result = Phone.tryCreate('11912345678');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('11912345678');
  });

  test('should accept a ten digit landline', () => {
    const result = Phone.tryCreate('1132654321');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('1132654321');
  });

  test('should accept a foreign number without stripping its country code', () => {
    const result = Phone.tryCreate('+351 912 345 678');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('351912345678');
  });

  test('should accept any leading pair of digits', () => {
    const result = Phone.tryCreate('(99) 91234-5678');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('99912345678');
  });

  test('should fail when the value carries a trailing annotation', () => {
    const result = Phone.tryCreate('11 91234-5678 (casa)');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Phone.INVALID_FORMAT);
  });

  test('should fail when plus sign is not the first character', () => {
    const result = Phone.tryCreate('11+912345678');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Phone.INVALID_FORMAT);
  });

  test('should fail when there are fewer digits than the minimum', () => {
    const result = Phone.tryCreate('1234567');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Phone.INVALID_LENGTH);
  });

  test('should fail when there are more digits than the maximum', () => {
    const result = Phone.tryCreate('1234567890123456');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Phone.INVALID_LENGTH);
  });

  test('should return null when value is null and config is optional', () => {
    const result = Phone.tryCreate(null, { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });

  test('should return null when value is blank and config is optional', () => {
    const result = Phone.tryCreate('   ', { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });

  test('should fail when value is empty and config is not optional', () => {
    const result = Phone.tryCreate('', {});

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain(Phone.INVALID_FORMAT);
  });

  test('should create with create method', () => {
    const phone = Phone.create('11912345678');

    expect(phone.value).toBe('11912345678');
  });

  test('should throw when create receives an invalid phone', () => {
    expect(() => Phone.create('abc')).toThrow();
  });
});
