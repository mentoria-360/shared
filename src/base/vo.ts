import type { MetadataProps } from './metadata';
import { Metadata } from './metadata';

export interface ValueObjectConfig {
  meta?: MetadataProps;
}

export function resolveVoConfig(metaOrConfig?: Metadata | ValueObjectConfig): ValueObjectConfig | undefined {
  if (!metaOrConfig) return undefined;
  if (metaOrConfig instanceof Metadata) return { meta: metaOrConfig.props };
  return metaOrConfig;
}

export abstract class ValueObject<T, Config extends ValueObjectConfig> {
  constructor(
    readonly value: T,
    readonly config?: Config,
  ) {}

  equals(vo: ValueObject<T, Config>): boolean {
    return this.value === vo.value;
  }

  notEquals(vo: ValueObject<T, Config>): boolean {
    return !this.equals(vo);
  }
}
