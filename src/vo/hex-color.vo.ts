import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class HexColor extends ValueObject<string, ValueObjectConfig> {
  constructor(value: string, config?: ValueObjectConfig) {
    const normalized = HexColor.normalize(value);
    if (!HexColor.isValid(normalized)) {
      throw new ValidationError({ code: 'hex-color.invalid' });
    }

    super(normalized, config);
  }

  public static create(value: string, metaOrConfig?: Metadata | ValueObjectConfig): HexColor {
    const result = HexColor.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<HexColor> {
    return Result.try(() => new HexColor(value, resolveVoConfig(metaOrConfig)));
  }

  public static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const regex = /^#(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/;
    return regex.test(value.trim().toUpperCase());
  }

  private static normalize(value: string): string {
    const normalized = value?.trim().toUpperCase() ?? '';
    return normalized.startsWith('#') ? normalized : `#${normalized}`;
  }
}
