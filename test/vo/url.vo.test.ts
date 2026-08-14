import { Url } from '../../src';

const invalidCode = 'url.invalid';

describe('Url', () => {
  test('should create valid url with tryCreate', () => {
    const result = Url.tryCreate('https://example.com/path');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('https://example.com/path');
  });

  test('should trim url before creating', () => {
    const result = Url.tryCreate('  https://example.com  ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('https://example.com');
  });

  test('should create valid url with create', () => {
    const url = Url.create('https://pharmacore.com');

    expect(url.value).toBe('https://pharmacore.com');
  });

  test('should expose domain, protocol, pathname and parameters', () => {
    const url = Url.create('https://www.google.com/search?q=typescript&hl=pt-BR');

    expect(url.domain).toBe('www.google.com');
    expect(url.protocol).toBe('https:');
    expect(url.pathname).toBe('/search');
    expect(url.parameters).toEqual({ q: 'typescript', hl: 'pt-BR' });
  });

  test('should validate url with isValid', () => {
    expect(Url.isValid('https://www.google.com/search?q=typescript')).toBe(true);
    expect(Url.isValid('www.google.com')).toBe(false);
  });

  test('should throw ValidationError for invalid constructor input', () => {
    expect(() => Url.create(undefined as unknown as string)).toThrow();
    expect(() => Url.create('')).toThrow();
    expect(() => Url.create('www.google.com')).toThrow();
    expect(() => Url.create('https//www.google.com')).toThrow();
  });

  test('should fail with invalid url', () => {
    const result = Url.tryCreate('invalid-url');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('url.invalid');
  });

  test('should fail when value is not a string', () => {
    const result = Url.tryCreate(null as unknown as string);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('url.invalid');
  });

  test('should map invalid tryCreate error code', () => {
    const result = Url.tryCreate('www.google.com');

    expect(result.isFailure).toBe(true);
    expect(result.errors[0]).toBe(invalidCode);
  });

  test('should throw when create receives invalid url', () => {
    expect(() => Url.create('invalid-url')).toThrow();
  });
});
