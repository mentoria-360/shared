import { OptionalConfig, Result } from '../base';
import { SharedErrors } from '../errors';
import { Text, TextConfig } from './text.vo';

export class ShortDescription extends Text {
  protected static override readonly TOO_SHORT: string =
    SharedErrors.SHORT_DESCRIPTION_TOO_SHORT;
  protected static override readonly TOO_LONG: string =
    SharedErrors.SHORT_DESCRIPTION_TOO_LONG;
  protected static override readonly DEFAULT_MIN_LENGTH: number = 15;
  protected static override readonly DEFAULT_MAX_LENGTH = 80;

  public static create(value: string, config?: TextConfig): ShortDescription {
    return super.create(value, config) as ShortDescription;
  }

  public static tryCreate(
    text: string | null | undefined,
    config: OptionalConfig<TextConfig>,
  ): Result<ShortDescription | null>;
  public static tryCreate(
    text: string,
    config?: TextConfig,
  ): Result<ShortDescription>;
  public static tryCreate(
    text: string | null | undefined,
    config?: TextConfig,
  ): Result<ShortDescription | null> {
    return (super.tryCreate as typeof ShortDescription.tryCreate)(text, config);
  }
}
