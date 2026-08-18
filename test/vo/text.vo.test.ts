import { Text } from '../../src';

describe('Text', () => {
  test('should create valid text with tryCreate', () => {
    const result = Text.tryCreate('Valid text');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Valid text');
  });

  test('should trim text before creating', () => {
    const result = Text.tryCreate('   Text with spaces   ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Text with spaces');
  });

  test('should fail when text is shorter than minLength', () => {
    const result = Text.tryCreate('ab', { minLength: 3 });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('TEXT_TOO_SHORT');
  });

  test('should fail when text is longer than maxLength', () => {
    const result = Text.tryCreate('abcd', { maxLength: 3 });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('TEXT_TOO_LONG');
  });

  test('should ignore max validation when maxLength is 0', () => {
    const result = Text.tryCreate('longer text', { maxLength: 0 });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('longer text');
  });

  test('should fail when text is undefined', () => {
    const result = Text.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('TEXT_TOO_SHORT');
  });

  test('should create with create method', () => {
    const text = Text.create('  Content  ');

    expect(text.value).toBe('Content');
  });

  test('should throw when create receives invalid text', () => {
    expect(() => Text.create('')).toThrow();
  });
});
