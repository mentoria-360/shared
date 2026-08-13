import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class Alias extends ValueObject<string, ValueObjectConfig> {
  constructor(value: string, config?: ValueObjectConfig) {
    super(Alias.normalize(value), config);
  }

  public static create(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Alias {
    const result = Alias.tryCreate(value, metaOrConfig);
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

  public static isValid(value: string): boolean {
    try {
      Alias.normalize(value);
      return true;
    } catch {
      return false;
    }
  }

  public static tryCreate(value: string | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<Alias | null>;
  public static tryCreate(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Alias>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: ValueObjectConfig): Result<Alias | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Alias | null>(null);
    }

    return Result.try(() => new Alias(value as string, resolveVoConfig(metaOrConfig)));
  }

  private static normalize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError({ code: 'alias.invalid' });
    }

    const normalized = value.toLowerCase();

    if (normalized !== normalized.trim() || /\s/.test(normalized) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
      throw new ValidationError({ code: 'alias.invalid' });
    }

    return normalized;
  }
}
