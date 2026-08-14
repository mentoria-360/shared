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

interface PersonNameConfig extends ValueObjectConfig {}

export class PersonName extends ValueObject<string, PersonNameConfig> {
  private static readonly TOO_SHORT = 'person-name.too-short';
  private static readonly TOO_LONG = 'person-name.too-long';
  private static readonly SURNAME_MISSING = 'person-name.surname-missing';
  static readonly NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ'`´^~\- ]+$/;

  constructor(value: string, config?: PersonNameConfig) {
    super(value, config);
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

  public static create(
    value: string,
    metaOrConfig?: PersonNameConfig,
  ): PersonName {
    const result = PersonName.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(
    value: string | null | undefined,
    config: OptionalConfig<PersonNameConfig>,
  ): Result<PersonName | null>;
  public static tryCreate(
    value: string,
    metaOrConfig?: Metadata | PersonNameConfig,
  ): Result<PersonName>;
  public static tryCreate(
    value: string | null | undefined,
    metaOrConfig?: PersonNameConfig,
  ): Result<PersonName | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<PersonName | null>(null);
    }
    try {
      return Result.ok(
        new PersonName(
          PersonName.ensureValid(value ?? ''),
          resolveVoConfig(metaOrConfig) as PersonNameConfig,
        ),
      );
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static ensureValid(value: string): string {
    const trimmedValue = value.trim();
    const min = 3;
    const max = 50;

    if (trimmedValue.length < min) {
      throw new ValidationError({ code: PersonName.TOO_SHORT });
    }

    if (trimmedValue.length > max) {
      throw new ValidationError({ code: PersonName.TOO_LONG });
    }

    const words = trimmedValue.split(/\s+/).filter((w) => w.length > 0);
    if (words.length < 2) {
      throw new ValidationError({ code: PersonName.SURNAME_MISSING });
    }

    const first = words[0]!;
    const last = words[words.length - 1]!;
    if (first.length < 2 || last.length < 2) {
      throw new ValidationError({ code: PersonName.TOO_SHORT });
    }

    if (!PersonName.NAME_REGEX.test(trimmedValue)) {
      throw new ValidationError({ code: PersonName.SURNAME_MISSING });
    }

    return trimmedValue;
  }
}
