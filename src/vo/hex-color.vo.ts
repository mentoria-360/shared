import { Result } from '../base/result';
import {
  OptionalConfig,
  isEmptyValue,
  ValueObject,
  ValueObjectConfig,
  resolveVoConfig,
} from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../errors/validation-error';
import { SharedErrors } from '../errors';
export class HexColor extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_HEX_COLOR = SharedErrors.HEX_COLOR_INVALID;
  static readonly HEX_REGEX =
    /^#(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    return HexColor.HEX_REGEX.test(value.trim().toUpperCase());
  }

  public static create(
    value: string,
    metaOrConfig?: ValueObjectConfig,
  ): HexColor {
    const result = HexColor.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<HexColor | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<HexColor>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<HexColor | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<HexColor | null>(null);
    }
    try {
      const normalized = HexColor.normalize(value as string);

      if (!HexColor.HEX_REGEX.test(normalized)) {
        throw new ValidationError({ code: HexColor.INVALID_HEX_COLOR });
      }

      return Result.ok(new HexColor(normalized, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static normalize(value: string): string {
    const normalized = value?.trim().toUpperCase() ?? '';
    return normalized.startsWith('#') ? normalized : `#${normalized}`;
  }
}
