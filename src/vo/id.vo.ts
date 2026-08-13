import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';
import { v4 as uuidv4 } from 'uuid';

export class Id extends ValueObject<string, ValueObjectConfig> {
  constructor(value: string, config?: ValueObjectConfig) {
    const idValue = value?.trim().toLowerCase();
    if (!Id.isValid(idValue)) {
      throw new ValidationError({ code: 'id.invalid' });
    }

    super(idValue, config);
  }

  public static create(value?: string, metaOrConfig?: Metadata | ValueObjectConfig): Id {
    const result = Id.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<Id | null>;
  public static tryCreate(value?: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Id>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: ValueObjectConfig): Result<Id | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Id | null>(null);
    }

    return Result.try(() => {
      const hasValue = value !== undefined && value !== null && value !== '';
      const idValue = hasValue ? value!.trim().toLowerCase() : uuidv4();
      return new Id(idValue, resolveVoConfig(metaOrConfig));
    });
  }

  public static createUUID(): string {
    return uuidv4();
  }

  public static required(value: string | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<Id | null>;
  public static required(value: string, metaOrConfig?: Metadata | ValueObjectConfig): Result<Id>;
  public static required(value: string | null | undefined, metaOrConfig?: ValueObjectConfig): Result<Id | null> {
    if (isEmptyValue(value)) {
      return metaOrConfig?.optional ? Result.ok<Id | null>(null) : Result.fail('id.invalid');
    }

    return Id.tryCreate(value!, metaOrConfig);
  }

  public static isValid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}
