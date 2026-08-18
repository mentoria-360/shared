import { EncryptedPassword } from '../../src';

const VALID_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const INVALID_HASH = 'not-a-bcrypt-hash';

describe('EncryptedPassword', () => {
  test('should accept valid bcrypt hash', () => {
    const ep = EncryptedPassword.create(VALID_HASH);
    expect(ep.value).toBe(VALID_HASH);
  });

  test('should throw ValidationError for invalid hash', () => {
    expect(() => EncryptedPassword.create(INVALID_HASH)).toThrow();
  });

  test('should throw ValidationError when value is undefined', () => {
    expect(() => EncryptedPassword.create(undefined)).toThrow();
  });

  test('should validate hash via isValid', () => {
    expect(EncryptedPassword.isValid(VALID_HASH)).toBe(true);
    expect(EncryptedPassword.isValid(INVALID_HASH)).toBe(false);
  });

  test('should tryCreate valid hash', () => {
    const result = EncryptedPassword.tryCreate(VALID_HASH);
    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(VALID_HASH);
  });

  test('should tryCreate invalid hash', () => {
    const result = EncryptedPassword.tryCreate(INVALID_HASH);
    expect(result.isOk).toBe(false);
    expect(result.errors[0]).toBe('ENCRYPTED_PASSWORD_INVALID');
  });
});
