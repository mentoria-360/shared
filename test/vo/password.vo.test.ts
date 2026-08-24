import { Password } from '../../src';

describe('Password', () => {
  test('should create non-empty password', () => {
    expect(Password.create('123').value).toBe('123');
    expect(Password.create('abc123').value).toBe('abc123');
    expect(Password.create('%%StrongPassword123').value).toBe('%%StrongPassword123');
  });

  test('should throw when password is empty', () => {
    expect(() => Password.create(undefined as any)).toThrow('PASSWORD_EMPTY');
    expect(() => Password.create('')).toThrow('PASSWORD_EMPTY');
    expect(() => Password.create('     ')).toThrow('PASSWORD_EMPTY');
  });

  test('should tryCreate valid password', () => {
    const password = Password.tryCreate('123');
    expect(password.isOk).toBe(true);
  });

  test('should tryCreate invalid password', () => {
    const password = Password.tryCreate('    ');
    expect(password.isOk).toBe(false);
    expect(password.errors[0]).toBe('PASSWORD_EMPTY');
  });

  test('should create valid password via create', () => {
    const password = Password.create('secret123');
    expect(password.value).toBe('secret123');
  });

  test('should throw via create when password is invalid', () => {
    expect(() => Password.create('')).toThrow();
  });

  test('should accept bcrypt hash as a non-empty password', () => {
    const hash =
      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    expect(Password.create(hash).value).toBe(hash);
    expect(Password.tryCreate(hash).isOk).toBe(true);
  });

  test('should detect bcrypt hash via isHash', () => {
    const hash =
      '  $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy  ';
    expect(Password.isHash(hash)).toBe(true);
    expect(Password.isHash('Aa123456!')).toBe(false);
    expect(Password.isHash(undefined)).toBe(false);
  });
});
