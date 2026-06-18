import { Description } from '../../src';

describe('Description', () => {
  test('should create valid description with tryCreate', () => {
    const result = Description.tryCreate('This description has enough length to be valid.');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('This description has enough length to be valid.');
  });

  test('should trim description before creating', () => {
    const result = Description.tryCreate('   This description also has a valid minimum length.   ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('This description also has a valid minimum length.');
  });

  test('should fail when description is shorter than minimum length', () => {
    const result = Description.tryCreate('a'.repeat(19));

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('description.too-short');
  });

  test('should fail when description is longer than maximum length', () => {
    const result = Description.tryCreate('a'.repeat(2001));

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('description.too-long');
  });

  test('should ignore max validation when maxLength is 0', () => {
    const result = Description.tryCreate('a'.repeat(2500), { maxLength: 0 });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('a'.repeat(2500));
  });

  test('should fail when description is undefined', () => {
    const result = Description.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('description.too-short');
  });

  test('should create with create method', () => {
    const description = Description.create('  This description was created with the create method successfully.  ');

    expect(description.value).toBe('This description was created with the create method successfully.');
  });

  test('should throw when create receives invalid description', () => {
    expect(() => Description.create('short description')).toThrow();
  });
});
