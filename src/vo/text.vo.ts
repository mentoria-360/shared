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

  constructor(value: string, config?: TextConfig) {
    super(value, config);
  }

  public static validateAndTrim(
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

  public static create(value: string, metaOrConfig?: TextConfig): Text {
    const result = Text.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<Text | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | TextConfig,
  ): Result<Text>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: TextConfig,
  ): Result<Text | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Text | null>(null);
    }
    try {
      const config = resolveVoConfig(metaOrConfig) as TextConfig;
      const trimmed = Text.validateAndTrim(value as string, config, Text.rules);

      return Result.ok(new Text(trimmed, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
