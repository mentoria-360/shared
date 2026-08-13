import { ValueObject, ValueObjectConfig, isEmptyValue, Text } from '../../src';

interface TestConfig extends ValueObjectConfig {
  attribute?: string;
}

class TestValueObject extends ValueObject<string, TestConfig> {}

describe('ValueObject', () => {
  test('should store value and config', () => {
    const vo = new TestValueObject('abc', { attribute: 'name' });

    expect(vo.value).toBe('abc');
    expect(vo.config).toEqual({ attribute: 'name' });
  });

  test('should return true when values are equal', () => {
    const left = new TestValueObject('same');
    const right = new TestValueObject('same', { attribute: 'other' });

    expect(left.equals(right)).toBe(true);
    expect(left.notEquals(right)).toBe(false);
  });

  test('should return false when values are different', () => {
    const left = new TestValueObject('left');
    const right = new TestValueObject('right');

    expect(left.equals(right)).toBe(false);
    expect(left.notEquals(right)).toBe(true);
  });
});

describe('isEmptyValue', () => {
  test('should treat null, undefined, blank strings and NaN as empty', () => {
    expect(isEmptyValue(null)).toBe(true);
    expect(isEmptyValue(undefined)).toBe(true);
    expect(isEmptyValue('   ')).toBe(true);
    expect(isEmptyValue(NaN)).toBe(true);
  });
});

describe('optional value objects', () => {
  test('should resolve empty text input to null when optional is enabled', () => {
    const result = Text.tryCreate('   ', { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });
});
