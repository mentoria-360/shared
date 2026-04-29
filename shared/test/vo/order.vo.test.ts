import { Order } from '../../src';

describe('Order', () => {
  test('should create with valid positive integer starting from 1', () => {
    const result = Order.tryCreate(1);

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(1);
  });

  test('should fail when value is zero or negative', () => {
    const zero = Order.tryCreate(0);
    const negative = Order.tryCreate(-1);

    expect(zero.isFailure).toBe(true);
    expect(zero.errors).toContain('INVALID_ORDER');
    expect(negative.isFailure).toBe(true);
    expect(negative.errors).toContain('INVALID_ORDER');
  });

  test('should fail when value is not integer', () => {
    const result = Order.tryCreate(1.5);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_ORDER');
  });

  test('should fail when value is not finite number', () => {
    const nan = Order.tryCreate(Number.NaN);
    const positiveInfinity = Order.tryCreate(Number.POSITIVE_INFINITY);

    expect(nan.isFailure).toBe(true);
    expect(nan.errors).toContain('INVALID_ORDER');
    expect(positiveInfinity.isFailure).toBe(true);
    expect(positiveInfinity.errors).toContain('INVALID_ORDER');
  });

  test('should fail when value is not a number', () => {
    const result = Order.tryCreate('1' as unknown as number);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_ORDER');
  });

  test('should throw when create receives invalid value', () => {
    expect(() => Order.create(0)).toThrow();
  });

  test('should create order with create when value is valid', () => {
    const order = Order.create(2);

    expect(order.value).toBe(2);
  });

  test('should return default invalid error when unexpected error has no message', () => {
    const isIntegerSpy = jest.spyOn(Number, 'isInteger').mockImplementation(() => {
      throw {};
    });

    const result = Order.tryCreate(1);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('INVALID_ORDER');
    isIntegerSpy.mockRestore();
  });

  test('should compare in ascending order', () => {
    expect(Order.compareAsc(1, 2)).toBeLessThan(0);
    expect(Order.compareAsc(Order.create(2), Order.create(1))).toBeGreaterThan(0);
    expect(Order.compareAsc(Order.create(2), 2)).toBe(0);
  });

  test('should compare in descending order', () => {
    expect(Order.compareDesc(1, 2)).toBeGreaterThan(0);
    expect(Order.compareDesc(Order.create(2), Order.create(1))).toBeLessThan(0);
    expect(Order.compareDesc(Order.create(2), 2)).toBe(0);
  });

  test('should sort objects by order in ascending order', () => {
    const items = [
      { id: 'b', order: 2 },
      { id: 'a', order: Order.create(1) },
      { id: 'c', order: 3 },
    ];

    const sorted = Order.sortAsc(items);

    expect(sorted.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(items.map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });

  test('should sort objects by order in descending order', () => {
    const items = [
      { id: 'a', order: 1 },
      { id: 'c', order: Order.create(3) },
      { id: 'b', order: 2 },
    ];

    const sorted = Order.sortDesc(items);

    expect(sorted.map((item) => item.id)).toEqual(['c', 'b', 'a']);
    expect(items.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });
});
