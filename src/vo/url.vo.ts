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
import { SharedErrors } from '../errors';
export class Url extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_URL = SharedErrors.URL_INVALID;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
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

  public static create(value: string, metaOrConfig?: ValueObjectConfig): Url {
    const result = Url.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Url | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Url>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Url | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Url | null>(null);
    }
    try {
      const normalized = value?.trim() ?? '';

      if (!normalized || !Url.isValid(normalized)) {
        throw new ValidationError({ code: Url.INVALID_URL });
      }

      return Result.ok(new Url(normalized, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
