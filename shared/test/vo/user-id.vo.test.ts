import { UserId } from '../../src';
import { validate as isUuid } from 'uuid';

describe('UserId', () => {
  test('should create with valid provided id', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = UserId.tryCreate(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(UserId);
  });

  test('should create with create when id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const userId = UserId.create(validId, { attribute: 'id' });

    expect(userId.value).toBe(validId);
    expect(userId).toBeInstanceOf(UserId);
  });

  test('should throw on create when id is invalid', () => {
    expect(() => UserId.create('not-a-uuid')).toThrow('INVALID_USER_ID');
  });

  test('should have a failed result if provided value not valid', () => {
    const invalidId = 'not-a-uuid';
    const result = UserId.tryCreate(invalidId, { attribute: 'id' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_USER_ID');
  });

  test('should create a new id if no value is provided', () => {
    const result = UserId.tryCreate(undefined);

    expect(result.isOk).toBe(true);
    expect(isUuid(result.instance.value)).toBe(true);
    expect(result.instance).toBeInstanceOf(UserId);
  });

  test('should fail when required id is empty', () => {
    const result = UserId.required('');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_USER_ID');
  });

  test('should return result when required id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = UserId.required(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(UserId);
  });

  test('should throw when required id is invalid', () => {
    expect(() => UserId.required('invalid-id')).toThrow('INVALID_USER_ID');
  });
});
