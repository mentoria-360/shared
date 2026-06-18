import { Email } from '../../src';

describe('Email', () => {
  test('should create with valid email', () => {
    const result = Email.tryCreate('test@example.com');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('test@example.com');
  });

  test('should normalize email with spaces and uppercase letters', () => {
    const result = Email.tryCreate('  Test.User@Example.COM  ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('test.user@example.com');
  });

  test('should expose local and domain parts', () => {
    const email = Email.create('john.doe@pharmacore.com');

    expect(email.local).toBe('john.doe');
    expect(email.domain).toBe('pharmacore.com');
    expect(email.username).toBe('john.doe');
  });

  test('should validate email with isValid', () => {
    expect(Email.isValid('user@email.com')).toBe(true);
    expect(Email.isValid('user@email')).toBe(false);
  });

  test('should throw when constructing invalid email', () => {
    expect(() => new Email(undefined as any)).toThrow('email.invalid');
    expect(() => new Email('')).toThrow('email.invalid');
    expect(() => new Email('fulano')).toThrow('email.invalid');
    expect(() => new Email('fulano@zmail')).toThrow('email.invalid');
  });

  test('should map invalid tryCreate error code', () => {
    const result = Email.tryCreate('invalid-email@');
    expect(result.isFailure).toBe(true);
    expect(result.errors[0]).toBe('email.invalid');
  });

  test('should return empty local when split result is undefined', () => {
    const email = Object.create(Email.prototype) as Email & { value: any };
    email.value = {
      split: () => undefined,
    };

    expect(email.local).toBe('');
  });

  test('should return empty domain when split has no domain part', () => {
    const email = Object.create(Email.prototype) as Email & { value: any };
    email.value = {
      split: () => ['only-local'],
    };

    expect(email.domain).toBe('');
  });

  test('should fail with invalid email', () => {
    const result = Email.tryCreate('invalid-email');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('email.invalid');
  });

  test('should throw when using create with invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow();
  });
});
