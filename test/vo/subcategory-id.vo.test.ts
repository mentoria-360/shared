import { validate as isUuid } from 'uuid';

import { SubcategoryId } from '../../src';

describe('SubcategoryId', () => {
  test('should create with valid provided id', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = SubcategoryId.tryCreate(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(SubcategoryId);
  });

  test('should create with create when id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const subcategoryId = SubcategoryId.create(validId, { attribute: 'id' });

    expect(subcategoryId.value).toBe(validId);
    expect(subcategoryId).toBeInstanceOf(SubcategoryId);
  });

  test('should throw on create when id is invalid', () => {
    expect(() => SubcategoryId.create('not-a-uuid')).toThrow('INVALID_SUBCATEGORY_ID');
  });

  test('should have a failed result if provided value not valid', () => {
    const invalidId = 'not-a-uuid';
    const result = SubcategoryId.tryCreate(invalidId, { attribute: 'id' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_SUBCATEGORY_ID');
  });

  test('should create a new id if no value is provided', () => {
    const result = SubcategoryId.tryCreate(undefined);

    expect(result.isOk).toBe(true);
    expect(isUuid(result.instance.value)).toBe(true);
    expect(result.instance).toBeInstanceOf(SubcategoryId);
  });

  test('should fail when required id is empty', () => {
    const result = SubcategoryId.required('');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_SUBCATEGORY_ID');
  });

  test('should return result when required id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = SubcategoryId.required(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(SubcategoryId);
  });

  test('should throw when required id is invalid', () => {
    expect(() => SubcategoryId.required('invalid-id')).toThrow('INVALID_SUBCATEGORY_ID');
  });
});
