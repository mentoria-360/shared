import type { MetadataProps } from './metadata';

export default interface Message {
  code?: string;
  meta?: MetadataProps;
}
