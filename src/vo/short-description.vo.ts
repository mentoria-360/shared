import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { Text, TextConfig, TextValidationRules } from './text.vo';

export class ShortDescription extends Text {
  protected static override readonly rules: TextValidationRules = {
    minLength: 15,
    maxLength: 80,
    tooShortCode: 'short-description.too-short',
    tooLongCode: 'short-description.too-long',
  };

  constructor(value: string, config?: TextConfig) {
    const trimmed = Text.validateAndTrim(value, config, ShortDescription.rules);
    super(trimmed, config, { prevalidated: true });
  }

  public static create(value: string, metaOrConfig?: Metadata | TextConfig): ShortDescription {
    const result = ShortDescription.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<ShortDescription | null>;
  public static tryCreate(value: string, metaOrConfig?: Metadata | TextConfig): Result<ShortDescription>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: TextConfig): Result<ShortDescription | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<ShortDescription | null>(null);
    }

    return Result.try(() => new ShortDescription(value as string, resolveVoConfig(metaOrConfig) as TextConfig));
  }
}
