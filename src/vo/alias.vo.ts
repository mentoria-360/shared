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

export class Alias extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_ALIAS = SharedErrors.ALIAS_INVALID;
  static readonly ALIAS_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, metaOrConfig?: ValueObjectConfig): Alias {
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

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Alias | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Alias>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Alias | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Alias | null>(null);
    }
    try {
      if (typeof value !== 'string') {
        throw new ValidationError({ code: Alias.INVALID_ALIAS });
      }

      const alias = value.toLowerCase();

      if (
        alias !== alias.trim() ||
        /\s/.test(alias) ||
        !Alias.ALIAS_REGEX.test(alias)
      ) {
        throw new ValidationError({ code: Alias.INVALID_ALIAS });
      }

      return Result.ok(new Alias(alias, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
