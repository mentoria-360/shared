import { StrongPassword } from '../../src';

describe('StrongPassword', () => {
  test('should create a strong password with tryCreate', () => {
    const result = StrongPassword.tryCreate('Aa123456!');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Aa123456!');
  });

  test('should create a strong password with create', () => {
    const password = StrongPassword.create('Secure123@');

    expect(password.value).toBe('Secure123@');
  });

  test('should fail when password is too short', () => {
    const result = StrongPassword.tryCreate('Aa1!');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('strong-password.too-weak');
  });

  test('should fail when password has no uppercase letter', () => {
    const result = StrongPassword.tryCreate('aa123456!');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('strong-password.too-weak');
  });

  test('should fail when password has no lowercase letter', () => {
    const result = StrongPassword.tryCreate('AA123456!');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('strong-password.too-weak');
  });

  test('should fail when password has no number', () => {
    const result = StrongPassword.tryCreate('AaBbCcDd!');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('strong-password.too-weak');
  });

  test('should fail when password has no special character', () => {
    const result = StrongPassword.tryCreate('Aa123456');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('strong-password.too-weak');
  });

  test('should throw when create receives weak password', () => {
    expect(() => StrongPassword.create('weak')).toThrow();
    expect(() => new StrongPassword('1234567890')).toThrow('strong-password.too-weak');
    expect(() => new StrongPassword()).toThrow('strong-password.too-weak');
  });

  test('should map invalid tryCreate error code', () => {
    const result = StrongPassword.tryCreate('1234567890');
    expect(result.isFailure).toBe(true);
    expect(result.errors[0]).toBe('strong-password.too-weak');
  });
});
