import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class Url extends ValueObject<string, ValueObjectConfig> {
  constructor(value?: string, config?: ValueObjectConfig) {
    const normalized = value?.trim();
    if (!normalized || !Url.isValid(normalized)) {
      throw new ValidationError({ code: 'url.invalid' });
    }

    super(normalized, config);
  }

  get domain(): string {
    return new globalThis.URL(this.value).hostname;
  }

  get protocol(): string {
    return new globalThis.URL(this.value).protocol;
  }

  get pathname(): string {
    return new globalThis.URL(this.value).pathname;
  }

  get parameters(): Record<string, string> {
    const params = new globalThis.URL(this.value).searchParams;
    return Object.fromEntries(params.entries());
  }

  public static isValid(value: string): boolean {
    try {
      const parsed = new globalThis.URL(value);
      return /^https?:$/.test(parsed.protocol);
    } catch {
      return false;
    }
  }

  public static create(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Url {
    const result = Url.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<Url | null>;
  public static tryCreate(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Url>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: ValueObjectConfig): Result<Url | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Url | null>(null);
    }

    return Result.try(() => new Url(value as string, resolveVoConfig(metaOrConfig)));
  }
}
