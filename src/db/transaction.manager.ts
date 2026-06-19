export type TransactionContext<Client = unknown> = {
	client: Client
}

export type PrismaTransactionContext = TransactionContext

export interface TransactionManager<Context = TransactionContext> {
	runInTransaction<T>(fn: (context: Context) => Promise<T>): Promise<T>
}
