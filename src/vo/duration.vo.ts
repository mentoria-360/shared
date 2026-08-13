import { Result } from '../base/result';
import { OptionalConfig, isEmptyValue, ValueObject, ValueObjectConfig, resolveVoConfig } from '../base/vo';
import { Metadata } from '../base/metadata';
import { ValidationError } from '../base/validation-error';

export class Duration extends ValueObject<number, ValueObjectConfig> {
  static readonly ONE_MINUTE: number = 60;
  static readonly ONE_HOUR: number = 3600;
  static readonly ONE_DAY: number = 86400;

  constructor(value: number, config?: ValueObjectConfig) {
    if (value < 0) {
      throw new ValidationError({
        code: 'duration.negative',
        meta: config?.meta ? { ...config.meta, value } : { value },
      });
    }

    super(value, config);
  }

  public static create(value: number, metaOrConfig?: Metadata | ValueObjectConfig): Duration {
    const result = Duration.tryCreate(value, metaOrConfig);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: number | null | undefined, config: OptionalConfig<ValueObjectConfig>): Result<Duration | null>;
  public static tryCreate(value: number, metaOrConfig?: Metadata | ValueObjectConfig): Result<Duration>;
  public static tryCreate(value: number | null | undefined, metaOrConfig?: ValueObjectConfig): Result<Duration | null> {
    if (metaOrConfig?.optional && isEmptyValue(value)) {
      return Result.ok<Duration | null>(null);
    }

    return Result.try(() => new Duration(value as number, resolveVoConfig(metaOrConfig)));
  }

  static zero() {
    return new Duration(0);
  }

  static inSeconds(seconds: number) {
    return new Duration(seconds);
  }

  static from(_: { d?: number; h?: number; m?: number; s?: number }) {
    return new Duration(
      (_.d ?? 0) * this.ONE_DAY + (_.h ?? 0) * this.ONE_HOUR + (_.m ?? 0) * this.ONE_MINUTE + (_.s ?? 0),
    );
  }

  get inSeconds() {
    return this.value;
  }

  get inMinutes() {
    return Math.floor(this.inSeconds / Duration.ONE_MINUTE);
  }

  get inHours() {
    return Math.floor(this.inSeconds / Duration.ONE_HOUR);
  }

  get inDays() {
    return Math.floor(this.inSeconds / Duration.ONE_DAY);
  }

  get toHMS() {
    const { h, m, s } = this._parts();
    return `${h}h ${m}m ${s}s`;
  }

  get toHM() {
    const { h, m } = this._parts();
    return `${h}h ${m}m`;
  }

  get hoursAndMinutes() {
    const { h, m } = this._parts();
    return {
      hours: h,
      minutes: m,
    };
  }

  get toMS() {
    const h = parseInt(this._parts(1).h);
    const m = parseInt(this._parts(1).m);
    const { s } = this._parts();
    const totalMinutes = `${h * 60 + m}`.padStart(2, '0');
    return `${totalMinutes}m ${s}s`;
  }

  add(duration: Duration) {
    return Duration.from({
      s: this.inSeconds + duration.inSeconds,
    });
  }

  private _parts(n = 2): { h: string; m: string; s: string } {
    const v = this.inSeconds;
    const h = v > 3600 ? Math.floor(v / 3600) : 0;
    const m = v - h * 3600 > 60 ? Math.floor((v - h * 3600) / 60) : 0;
    const s = v - h * 3600 - m * 60;
    return {
      h: `${h}`.padStart(n, '0'),
      m: `${m}`.padStart(n, '0'),
      s: `${s}`.padStart(n, '0'),
    };
  }
}
