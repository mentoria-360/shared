import { Flag, Name, NonNegativeInteger, Order } from '../../src';

describe('Name', () => {
  test('should create with valid name', () => {
    const result = Name.tryCreate('Produto Teste');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Produto Teste');
  });

  test('should trim value before creating', () => {
    const result = Name.tryCreate('   Nome Valido   ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Nome Valido');
  });

  test('should fail when name is too short', () => {
    const result = Name.tryCreate('A');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('NAME_TOO_SHORT');
  });

  test('should fail when name is too long', () => {
    const result = Name.tryCreate('a'.repeat(101));

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('NAME_TOO_LONG');
  });

  test('should resolve empty input to null when optional is enabled', () => {
    const result = Name.tryCreate('   ', { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });
});

describe('Order', () => {
  test('should create order with tryCreate', () => {
    const result = Order.tryCreate(3);

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(3);
  });

  test('should fail when order is not an integer', () => {
    const result = Order.tryCreate(1.5);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_ORDER');
  });

  test('should sort items using order value objects', () => {
    const items = [
      { id: 1, order: Order.create(3) },
      { id: 2, order: Order.create(1) },
      { id: 3, order: Order.create(2) },
    ];

    const sortedItems = Order.sort(items);

    expect(sortedItems.map((item) => item.id)).toEqual([2, 3, 1]);
  });

  test('should resolve empty input to null when optional is enabled', () => {
    const result = Order.tryCreate(null, { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });
});

describe('Flag', () => {
  test('should create with true and preserve value', () => {
    const result = Flag.tryCreate(true);

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(true);
  });

  test('should fail with string "true"', () => {
    const result = Flag.tryCreate('true' as unknown as boolean);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_FLAG');
  });

  test('should resolve empty input to null when optional is enabled', () => {
    const result = Flag.tryCreate(undefined, { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });
});

describe('NonNegativeInteger', () => {
  test('should create with 0', () => {
    const result = NonNegativeInteger.tryCreate(0);

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(0);
  });

  test('should fail with non-integer number', () => {
    const result = NonNegativeInteger.tryCreate(1.5);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('NON_NEGATIVE_INTEGER_INVALID');
  });

  test('should return the exact configured error code when errorCode is provided', () => {
    const result = NonNegativeInteger.tryCreate(-1, { errorCode: 'ATTACHMENT_SIZE_INVALID' });

    expect(result.isFailure).toBe(true);
    expect(result.errors).toEqual(['ATTACHMENT_SIZE_INVALID']);
  });

  test('should resolve empty input to null when optional is enabled', () => {
    const result = NonNegativeInteger.tryCreate(NaN, { optional: true });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeNull();
  });
});
