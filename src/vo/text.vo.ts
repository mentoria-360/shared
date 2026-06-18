import { Result } from '../base/result';
import { ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export interface TextConfig extends ValueObjectConfig {
  minLength?: number;
  maxLength?: number;
}

export interface TextValidationRules {
  minLength: number;
  maxLength: number;
  tooShortCode: string;
  tooLongCode: string;
}

export class Text extends ValueObject<string, TextConfig> {
  protected static readonly rules: TextValidationRules = {
    minLength: 1,
    maxLength: Number.MAX_SAFE_INTEGER,
    tooShortCode: 'text.too-short',
    tooLongCode: 'text.too-long',
  };

  constructor(value: string, config?: TextConfig, options?: { prevalidated?: boolean }) {
    const trimmed = options?.prevalidated
      ? (value?.trim() ?? '')
      : Text.validateAndTrim(value, config, Text.rules);

    super(trimmed, config);
  }

  protected static validateAndTrim(
    value: string,
    config: TextConfig | undefined,
    rules: TextValidationRules,
  ): string {
    const trimmed = value?.trim() ?? '';
    const min = config?.minLength ?? rules.minLength;
    const max = config?.maxLength ?? rules.maxLength;

    if (trimmed.length < min) {
      throw new ValidationError({ code: rules.tooShortCode });
    }

    if (max && trimmed.length > max) {
      throw new ValidationError({ code: rules.tooLongCode });
    }

    return trimmed;
  }

  public static create(value: string, metaOrConfig?: Metadata | TextConfig): Text {
    const result = Text.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string, metaOrConfig?: Metadata | TextConfig): Result<Text> {
    return Result.try(() => new Text(value, resolveVoConfig(metaOrConfig) as TextConfig));
  }
}
