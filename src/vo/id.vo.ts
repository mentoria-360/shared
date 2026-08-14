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
import { v4 as uuidv4 } from 'uuid';

export class Id extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_ID = 'id.invalid';
  static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static isValid(value: string): boolean {
    return Id.UUID_REGEX.test(value);
  }

  public static createUUID(): string {
    return uuidv4();
  }

  public static create(value?: string, metaOrConfig?: ValueObjectConfig): Id {
    const result = Id.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Id | null>;
  public static tryCreate(
    value?: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Id>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Id | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Id | null>(null);
    }
    try {
      const hasValue = value !== undefined && value !== null && value !== '';
      const idValue = hasValue ? value!.trim().toLowerCase() : uuidv4();

      if (!Id.isValid(idValue)) {
        throw new ValidationError({ code: Id.INVALID_ID });
      }

      return Result.ok(new Id(idValue, resolveVoConfig(metaOrConfig)));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  public static required(
    value: string | null | undefined,
    config: OptionalConfig<ValueObjectConfig>,
  ): Result<Id | null>;
  public static required(
    value: string,
    metaOrConfig?: Metadata | ValueObjectConfig,
  ): Result<Id>;
  public static required(
    value: string | null | undefined,
    metaOrConfig?: ValueObjectConfig,
  ): Result<Id | null> {
    if (isEmptyValue(value)) {
      return metaOrConfig?.optional
        ? Result.ok<Id | null>(null)
        : Result.fail(Id.INVALID_ID);
    }

    return Id.tryCreate(value!, metaOrConfig);
  }
}
