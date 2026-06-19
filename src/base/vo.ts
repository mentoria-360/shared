export interface ValueObjectConfig {
	attribute?: string
}

export default abstract class ValueObject<TValue, TConfig extends ValueObjectConfig = ValueObjectConfig> {
	constructor(
		readonly value: TValue,
		readonly config?: TConfig,
	) {}

	equals(vo: ValueObject<TValue, TConfig>): boolean {
		return this.value === vo.value
	}

	notEquals(vo: ValueObject<TValue, TConfig>): boolean {
		return !this.equals(vo)
	}
}

export { ValueObject }
