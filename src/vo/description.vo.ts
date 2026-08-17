import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { Text, TextConfig, TextValidationRules } from './text.vo';

export class Description extends Text {
  protected static override readonly rules: TextValidationRules = {
    minLength: 20,
    maxLength: 2000,
    tooShortCode: 'DESCRIPTION_TOO_SHORT',
    tooLongCode: 'DESCRIPTION_TOO_LONG',
  };

  constructor(value: string, config?: TextConfig) {
    super(value, config);
  }

  public static create(value: string, metaOrConfig?: TextConfig): Description {
    const result = Description.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<Description | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | TextConfig,
  ): Result<Description>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: TextConfig,
  ): Result<Description | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Description | null>(null);
    }
    try {
      const config = resolveVoConfig(metaOrConfig) as TextConfig;
      const trimmed = Text.validateAndTrim(
        value as string,
        config,
        Description.rules,
      );

      return Result.ok(new Description(trimmed, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
