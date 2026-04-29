import { Result, ValueObject, ValueObjectConfig } from '../base';

export class HexColor extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_HEX_COLOR = 'INVALID_HEX_COLOR';

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): HexColor {
    const result = HexColor.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string, config?: ValueObjectConfig): Result<HexColor> {
    try {
      const normalized = value?.trim().toUpperCase() ?? '';
      const withPrefix = normalized.startsWith('#') ? normalized : `#${normalized}`;
      const regex = /^#(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/;

      if (!regex.test(withPrefix)) {
        throw new Error(HexColor.INVALID_HEX_COLOR);
      }

      return Result.ok(new HexColor(withPrefix, config));
    } catch (error: any) {
      return Result.fail(error.message ?? HexColor.INVALID_HEX_COLOR);
    }
  }
}
