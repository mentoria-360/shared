import { AccountId } from '../../src';
import { validate as isUuid } from 'uuid';

describe('AccountId', () => {
  test('should create with valid provided id', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = AccountId.tryCreate(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(AccountId);
  });

  test('should create with create when id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const accountId = AccountId.create(validId, { attribute: 'id' });

    expect(accountId.value).toBe(validId);
    expect(accountId).toBeInstanceOf(AccountId);
  });

  test('should throw on create when id is invalid', () => {
    expect(() => AccountId.create('not-a-uuid')).toThrow('INVALID_ACCOUNT_ID');
  });

  test('should have a failed result if provided value not valid', () => {
    const invalidId = 'not-a-uuid';
    const result = AccountId.tryCreate(invalidId, { attribute: 'id' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_ACCOUNT_ID');
  });

  test('should create a new id if no value is provided', () => {
    const result = AccountId.tryCreate(undefined);

    expect(result.isOk).toBe(true);
    expect(isUuid(result.instance.value)).toBe(true);
    expect(result.instance).toBeInstanceOf(AccountId);
  });

  test('should fail when required id is empty', () => {
    const result = AccountId.required('');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_ACCOUNT_ID');
  });

  test('should return result when required id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = AccountId.required(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(AccountId);
  });

  test('should throw when required id is invalid', () => {
    expect(() => AccountId.required('invalid-id')).toThrow('INVALID_ACCOUNT_ID');
  });
});
