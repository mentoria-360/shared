import { Result } from './result';

export interface UseCase<IN, OUT> {
  execute(data: IN): Promise<Result<OUT>>;
}

export interface ResultUseCase<IN, OUT> extends UseCase<IN, OUT> {}
