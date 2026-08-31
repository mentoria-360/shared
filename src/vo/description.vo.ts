import { OptionalConfig, Result } from '../base';
import { SharedErrors } from '../errors';
import { Text, TextConfig } from './text.vo';

export class Description extends Text {
  protected static override readonly TOO_SHORT: string =
    SharedErrors.DESCRIPTION_TOO_SHORT;
  protected static override readonly TOO_LONG: string =
    SharedErrors.DESCRIPTION_TOO_LONG;
  protected static override readonly DEFAULT_MIN_LENGTH: number = 20;
  protected static override readonly DEFAULT_MAX_LENGTH = 2000;

  public static create(value: string, config?: TextConfig): Description {
    return super.create(value, config) as Description;
  }

  public static tryCreate(
    text: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<Description | null>;
  public static tryCreate(
    text: string,
    config?: TextConfig,
  ): Result<Description>;
  public static tryCreate(
    text: string | null | undefined,
    config?: TextConfig,
  ): Result<Description | null> {
    return (super.tryCreate as typeof Description.tryCreate)(text, config);
  }
}
