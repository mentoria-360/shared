import { Result } from '../base/result';
import { resolveVoConfig } from '../base/vo';
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

  public static tryCreate(value: string, metaOrConfig?: Metadata | TextConfig): Result<Description> {
    return Result.try(() => new Description(value, resolveVoConfig(metaOrConfig) as TextConfig));
  }
}
