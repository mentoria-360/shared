import { ShortDescription } from '../../src';

describe('ShortDescription', () => {
  test('should create valid short description with tryCreate', () => {
    const result = ShortDescription.tryCreate('Valid short description.');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Valid short description.');
  });

  test('should trim short description before creating', () => {
    const result = ShortDescription.tryCreate('   This is a valid short description.   ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('This is a valid short description.');
  });

  test('should fail when short description is shorter than minimum length', () => {
    const result = ShortDescription.tryCreate('a'.repeat(14));

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('SHORT_DESCRIPTION_TOO_SHORT');
  });

  test('should fail when short description is longer than maximum length', () => {
    const result = ShortDescription.tryCreate('a'.repeat(81));

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('SHORT_DESCRIPTION_TOO_LONG');
  });

  test('should ignore max validation when maxLength is 0', () => {
    const result = ShortDescription.tryCreate('a'.repeat(120), {
      maxLength: 0,
    });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('a'.repeat(120));
  });

  test('should fail when short description is undefined', () => {
    const result = ShortDescription.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('SHORT_DESCRIPTION_TOO_SHORT');
  });

  test('should create with create method', () => {
    const shortDescription = ShortDescription.create('  This is a short description created successfully.  ');

    expect(shortDescription.value).toBe('This is a short description created successfully.');
  });

  test('should throw when create receives invalid short description', () => {
    expect(() => ShortDescription.create('too short')).toThrow();
  });
});
