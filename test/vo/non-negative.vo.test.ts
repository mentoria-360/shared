import { NonNegative, ValidationError } from '../../src';

describe('NonNegative', () => {
  test('should create with valid values', () => {
    expect(new NonNegative(0).value).toBe(0);
    expect(new NonNegative(10).value).toBe(10);
    expect(new NonNegative(999.99).value).toBe(999.99);
  });

  test('should throw ValidationError for negative numbers', () => {
    expect(() => new NonNegative(-1)).toThrow(ValidationError);
    expect(() => new NonNegative(-100)).toThrow(ValidationError);
    expect(() => new NonNegative(-0.01)).toThrow(ValidationError);
  });

  test('should tryCreate valid value', () => {
    const nonNegative = NonNegative.tryCreate(10);
    expect(nonNegative.isOk).toBe(true);
  });

  test('should tryCreate invalid value', () => {
    const nonNegative = NonNegative.tryCreate(-10);
    expect(nonNegative.isOk).toBe(false);
    expect(nonNegative.errors[0]).toBe('non-negative.invalid');
  });

  test('should create valid value via create', () => {
    const nonNegative = NonNegative.create(0);
    expect(nonNegative.value).toBe(0);
  });

  test('should throw via create when value is negative', () => {
    expect(() => NonNegative.create(-1)).toThrow();
  });
});
