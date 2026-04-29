import { Result, ValueObject, ValueObjectConfig } from '../base';

export class Alias extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_ALIAS = 'INVALID_ALIAS';

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): Alias {
    const result = Alias.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static format(value: string, allowTrailingHyphen = false): string {
    if (typeof value !== 'string') {
      return '';
    }

    const normalizedValue = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const hasTrailingSeparator = /[^a-z0-9]$/.test(normalizedValue);

    const formattedValue = normalizedValue
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!allowTrailingHyphen || !hasTrailingSeparator || !formattedValue) {
      return formattedValue;
    }

    return `${formattedValue}-`;
  }

  public static tryCreate(value: string, config?: ValueObjectConfig): Result<Alias> {
    try {
      if (typeof value !== 'string') {
        throw new Error(Alias.INVALID_ALIAS);
      }

      const normalized = value.toLowerCase();

      if (normalized !== normalized.trim()) {
        throw new Error(Alias.INVALID_ALIAS);
      }
      if (/\s/.test(normalized)) {
        throw new Error(Alias.INVALID_ALIAS);
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
        throw new Error(Alias.INVALID_ALIAS);
      }

      return Result.ok(new Alias(normalized, config));
    } catch (error: any) {
      return Result.fail(error.message ?? Alias.INVALID_ALIAS);
    }
  }
}
