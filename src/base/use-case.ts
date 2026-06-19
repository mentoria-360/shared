import Result from "./result"

export default interface UseCase<IN, OUT, U = any> {
	execute(input: IN, user?: U): Promise<OUT>
}

export interface ResultUseCase<IN, OUT> {
	execute(input: IN): Promise<Result<OUT>>
}
