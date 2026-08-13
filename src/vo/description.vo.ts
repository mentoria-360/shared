import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { Text, TextConfig, TextValidationRules } from './text.vo';

export class Description extends Text {
  protected static override readonly rules: TextValidationRules = {
    minLength: 20,
    maxLength: 2000,
    tooShortCode: 'description.too-short',
    tooLongCode: 'description.too-long',
  };

  constructor(value: string, config?: TextConfig) {
    const trimmed = Text.validateAndTrim(value, config, Description.rules);
    super(trimmed, config, { prevalidated: true });
  }

  public static create(value: string, metaOrConfig?: Metadata | TextConfig): Description {
    const result = Description.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<Description | null>;
  public static tryCreate(value: string, metaOrConfig?: Metadata | TextConfig): Result<Description>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: TextConfig): Result<Description | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Description | null>(null);
    }

    return Result.try(() => new Description(value as string, resolveVoConfig(metaOrConfig) as TextConfig));
  }
}
