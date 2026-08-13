import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

interface PersonNameConfig extends ValueObjectConfig {}

export class PersonName extends ValueObject<string, PersonNameConfig> {
  constructor(value?: string, config?: PersonNameConfig) {
    super(PersonName.ensureValid(value ?? ''), config);
  }

  get firstName(): string {
    return this.value.split(/\s+/)[0]!;
  }

  get lastNames(): string[] {
    return this.value.split(/\s+/).slice(1);
  }

  get lastName(): string {
    const names = this.lastNames;
    return names[names.length - 1]!;
  }

  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`;
  }

  public static create(value: string, metaOrConfig?: Metadata | PersonNameConfig): PersonName {
    const result = PersonName.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string | null | undefined, config: OptionalConfig<PersonNameConfig>): Result<PersonName | null>;
  public static tryCreate(value: string, metaOrConfig?: Metadata | PersonNameConfig): Result<PersonName>;
  public static tryCreate(value: string | null | undefined, metaOrConfig?: PersonNameConfig): Result<PersonName | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<PersonName | null>(null);
    }

    return Result.try(() => new PersonName(value as string, resolveVoConfig(metaOrConfig) as PersonNameConfig));
  }

  private static ensureValid(value: string): string {
    const trimmedValue = value.trim();
    const min = 3;
    const max = 50;

    if (trimmedValue.length < min) {
      throw new ValidationError({ code: 'person-name.too-short' });
    }

    if (trimmedValue.length > max) {
      throw new ValidationError({ code: 'person-name.too-long' });
    }

    const words = trimmedValue.split(/\s+/).filter((w) => w.length > 0);
    if (words.length < 2) {
      throw new ValidationError({ code: 'person-name.surname-missing' });
    }

    const first = words[0]!;
    const last = words[words.length - 1]!;
    if (first.length < 2 || last.length < 2) {
      throw new ValidationError({ code: 'person-name.too-short' });
    }

    const validNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'`´^~\- ]+$/;
    if (!validNameRegex.test(trimmedValue)) {
      throw new ValidationError({ code: 'person-name.surname-missing' });
    }

    return trimmedValue;
  }
}
