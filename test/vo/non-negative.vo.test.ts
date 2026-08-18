import { NonNegative } from '../../src';

describe('NonNegative', () => {
  test('should create with valid values', () => {
    expect(NonNegative.create(0).value).toBe(0);
    expect(NonNegative.create(10).value).toBe(10);
    expect(NonNegative.create(999.99).value).toBe(999.99);
  });

  test('should throw ValidationError for negative numbers', () => {
    expect(() => NonNegative.create(-1)).toThrow();
    expect(() => NonNegative.create(-100)).toThrow();
    expect(() => NonNegative.create(-0.01)).toThrow();
  });

  test('should tryCreate valid value', () => {
    const nonNegative = NonNegative.tryCreate(10);
    expect(nonNegative.isOk).toBe(true);
  });

  test('should tryCreate invalid value', () => {
    const nonNegative = NonNegative.tryCreate(-10);
    expect(nonNegative.isOk).toBe(false);
    expect(nonNegative.errors[0]).toBe('NON_NEGATIVE_INVALID');
  });

  test('should create valid value via create', () => {
    const nonNegative = NonNegative.create(0);
    expect(nonNegative.value).toBe(0);
  });

  test('should throw via create when value is negative', () => {
    expect(() => NonNegative.create(-1)).toThrow();
  });

  test('should fail when value is not a finite number', () => {
    const nan = NonNegative.tryCreate(Number.NaN);
    const infinity = NonNegative.tryCreate(Number.POSITIVE_INFINITY);

    expect(nan.isFailure).toBe(true);
    expect(nan.errors).toContain('NON_NEGATIVE_INVALID');
    expect(infinity.isFailure).toBe(true);
    expect(infinity.errors).toContain('NON_NEGATIVE_INVALID');
  });
});
