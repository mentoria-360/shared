import Metadata from '../base/metadata';

export interface CloneableProps {
  [key: string]: unknown;
}

export default abstract class Cloneable<Tipo, Props extends object> {
  constructor(
    readonly props: Props,
    readonly meta?: Metadata,
  ) {}

  clone(newProps: Partial<Props>, ...args: any[]): Tipo {
    return new (this.constructor as any)(
      {
        ...this.props,
        ...newProps,
      },
      this.meta,
      ...args,
    );
  }
}
