import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export type DateOnlyInput = string | Date;

export class DateOnly extends ValueObject<string, ValueObjectConfig> {
  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  get asDate(): Date {
    return new Date(`${this.value}T00:00:00.000Z`);
  }

  public static create(value: DateOnlyInput, metaOrConfig?: Metadata | ValueObjectConfig): DateOnly {
    const result = DateOnly.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: DateOnlyInput | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<DateOnly | null>;
  public static tryCreate(value: DateOnlyInput, metaOrConfig?: Metadata | ValueObjectConfig): Result<DateOnly>;
  public static tryCreate(value: DateOnlyInput | null | undefined, metaOrConfig?: ValueObjectConfig): Result<DateOnly | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<DateOnly | null>(null);
    }

    return Result.try(() => new DateOnly(DateOnly.normalize(value as DateOnlyInput), resolveVoConfig(metaOrConfig)));
  }

  private static normalize(value: DateOnlyInput): string {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new ValidationError({ code: 'date-only.invalid' });
      }

      return value.toISOString().slice(0, 10);
    }

    const rawValue = value?.trim();
    if (!rawValue) {
      throw new ValidationError({ code: 'date-only.invalid' });
    }

    const plainDateMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (plainDateMatch) {
      const [, yearValue, monthValue, dayValue] = plainDateMatch;
      const year = Number(yearValue);
      const month = Number(monthValue);
      const day = Number(dayValue);
      const normalizedDate = new Date(Date.UTC(year, month - 1, day));
      const isExactDate =
        normalizedDate.getUTCFullYear() === year &&
        normalizedDate.getUTCMonth() === month - 1 &&
        normalizedDate.getUTCDate() === day;

      if (!isExactDate) {
        throw new ValidationError({ code: 'date-only.invalid' });
      }

      return normalizedDate.toISOString().slice(0, 10);
    }

    const parsedDate = new Date(rawValue);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new ValidationError({ code: 'date-only.invalid' });
    }

    return parsedDate.toISOString().slice(0, 10);
  }
}
