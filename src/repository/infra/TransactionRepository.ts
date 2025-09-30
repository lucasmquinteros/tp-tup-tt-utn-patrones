import {Transaction} from "../../models/Transaction/Transaction";

export class TransactionRepository {
    private transactions: Transaction[] = [];

    saveTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
    }
    getTransactionsByUserId(userId: string): Transaction[] {
        return this.transactions.filter((t) => t.userId === userId);
    }
    getAllTransactions(): Transaction[] {
        return [...this.transactions];
    }
}