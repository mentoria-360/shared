import { Result, ValueObject, ValueObjectConfig } from '../base';

export interface HasOrder {
  order: number | Order;
}

export class Order extends ValueObject<number, ValueObjectConfig> {
  private static readonly INVALID_ORDER = 'INVALID_ORDER';

  private constructor(value: number, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: number, config?: ValueObjectConfig): Order {
    const result = Order.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: number, config?: ValueObjectConfig): Result<Order> {
    try {
      if (typeof value !== 'number') {
        throw new Error(Order.INVALID_ORDER);
      }
      if (!Number.isFinite(value)) {
        throw new Error(Order.INVALID_ORDER);
      }
      if (!Number.isInteger(value)) {
        throw new Error(Order.INVALID_ORDER);
      }
      if (value < 1) {
        throw new Error(Order.INVALID_ORDER);
      }

      return Result.ok(new Order(value, config));
    } catch (error: any) {
      return Result.fail(error.message ?? Order.INVALID_ORDER);
    }
  }

  public static compareAsc(a: number | Order, b: number | Order): number {
    return Order.unwrap(a) - Order.unwrap(b);
  }

  public static compareDesc(a: number | Order, b: number | Order): number {
    return Order.unwrap(b) - Order.unwrap(a);
  }

  public static sortAsc<T extends HasOrder>(items: readonly T[]): T[] {
    return [...items].sort((a, b) => Order.compareAsc(a.order, b.order));
  }

  public static sortDesc<T extends HasOrder>(items: readonly T[]): T[] {
    return [...items].sort((a, b) => Order.compareDesc(a.order, b.order));
  }

  private static unwrap(value: number | Order): number {
    return value instanceof Order ? value.value : value;
  }
}
