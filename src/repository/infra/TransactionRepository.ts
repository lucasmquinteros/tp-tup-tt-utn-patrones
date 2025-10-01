import { error } from "console";
import { Transaction } from "../../models/Transaction/Transaction";
import { BaseRepository } from "../BaseRepository";

export class TransactionRepository extends BaseRepository<Transaction> {
  private transactions: Transaction[] = [];
  private static instance: TransactionRepository;
  private constructor() {
    super();
  }
  initializeDefaultData(): void {
    // No default data for transactions
  }
  static getInstance() {
    if (TransactionRepository.instance) return TransactionRepository.instance;
    TransactionRepository.instance = new TransactionRepository();
    return TransactionRepository.instance;
  }
  findById(id: string): Transaction {
    const transaction = this.transactions.find((t) => t.id === id);
    if (!transaction) throw new Error("Transaction no encontrado");
    return transaction;
  }

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
