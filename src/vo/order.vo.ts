import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig } from '../base/vo';
import { ValidationError } from '../base/validation-error';

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

  public static tryCreate(
    value: number | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Order | null>;
  public static tryCreate(value: number, config?: ValueObjectConfig): Result<Order>;
  public static tryCreate(value: number | null | undefined, config?: ValueObjectConfig): Result<Order | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<Order | null>(null);
    }

    if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      return Result.fail(Order.INVALID_ORDER);
    }

    return Result.ok(new Order(value, config));
  }

  public static try(value: number, config?: ValueObjectConfig): Result<Order> {
    return Order.tryCreate(value, config);
  }

  public static sort<T extends { order: Order | number }>(itemsInOrder: T[]): T[] {
    return itemsInOrder.sort((a, b) => {
      const orderA = a.order instanceof Order ? a.order.value : a.order;
      const orderB = b.order instanceof Order ? b.order.value : b.order;
      return orderA - orderB;
    });
  }
}
