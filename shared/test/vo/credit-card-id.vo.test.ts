import { CreditCardId } from '../../src';
import { validate as isUuid } from 'uuid';

describe('CreditCardId', () => {
  test('should create with valid provided id', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = CreditCardId.tryCreate(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(CreditCardId);
  });

  test('should create with create when id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const creditCardId = CreditCardId.create(validId, { attribute: 'id' });

    expect(creditCardId.value).toBe(validId);
    expect(creditCardId).toBeInstanceOf(CreditCardId);
  });

  test('should throw on create when id is invalid', () => {
    expect(() => CreditCardId.create('not-a-uuid')).toThrow('INVALID_CREDIT_CARD_ID');
  });

  test('should have a failed result if provided value not valid', () => {
    const invalidId = 'not-a-uuid';
    const result = CreditCardId.tryCreate(invalidId, { attribute: 'id' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CREDIT_CARD_ID');
  });

  test('should create a new id if no value is provided', () => {
    const result = CreditCardId.tryCreate(undefined);

    expect(result.isOk).toBe(true);
    expect(isUuid(result.instance.value)).toBe(true);
    expect(result.instance).toBeInstanceOf(CreditCardId);
  });

  test('should fail when required id is empty', () => {
    const result = CreditCardId.required('');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_CREDIT_CARD_ID');
  });

  test('should return result when required id is valid', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const result = CreditCardId.required(validId, { attribute: 'id' });

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(validId);
    expect(result.instance).toBeInstanceOf(CreditCardId);
  });

  test('should throw when required id is invalid', () => {
    expect(() => CreditCardId.required('invalid-id')).toThrow('INVALID_CREDIT_CARD_ID');
  });
});
