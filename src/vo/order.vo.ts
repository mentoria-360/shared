import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';
import { SharedErrors } from '../errors';
export class Order extends ValueObject<number, ValueObjectConfig> {
  private static readonly INVALID_ORDER = SharedErrors.ORDER_INVALID;

  constructor(value: number, config?: ValueObjectConfig) {
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
  public static tryCreate(
    value: number,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Order>;
  public static tryCreate(
    value: number | null | undefined,
    config?: ValueObjectConfig,
  ): Result<Order | null> {
    if (config?.optional && isEmptyValue(value)) {
      return Result.ok<Order | null>(null);
    }
    try {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value) ||
        value < 0
      ) {
        throw new ValidationError({ code: Order.INVALID_ORDER });
      }

      return Result.ok(new Order(value, resolveVoConfig(config)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  public static try(value: number, config?: ValueObjectConfig): Result<Order> {
    return Order.tryCreate(value, config);
  }

  public static sort<T extends { order: Order | number }>(
    itemsInOrder: T[],
  ): T[] {
    return itemsInOrder.sort((a, b) => {
      const orderA = a.order instanceof Order ? a.order.value : a.order;
      const orderB = b.order instanceof Order ? b.order.value : b.order;
      return orderA - orderB;
    });
  }
}
