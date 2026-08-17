import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { Text, TextConfig, TextValidationRules } from './text.vo';

export class ShortDescription extends Text {
  protected static override readonly rules: TextValidationRules = {
    minLength: 15,
    maxLength: 80,
    tooShortCode: 'SHORT_DESCRIPTION_TOO_SHORT',
    tooLongCode: 'SHORT_DESCRIPTION_TOO_LONG',
  };

  constructor(value: string, config?: TextConfig) {
    super(value, config);
  }

  public static create(
    value: string,
    metaOrConfig?: TextConfig,
  ): ShortDescription {
    const result = ShortDescription.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<ShortDescription | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | TextConfig,
  ): Result<ShortDescription>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: TextConfig,
  ): Result<ShortDescription | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<ShortDescription | null>(null);
    }
    try {
      const config = resolveVoConfig(metaOrConfig) as TextConfig;
      const trimmed = Text.validateAndTrim(
        value as string,
        config,
        ShortDescription.rules,
      );

      return Result.ok(new ShortDescription(trimmed, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
