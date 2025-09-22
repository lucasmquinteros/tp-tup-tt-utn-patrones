import {Transaction} from "../../models/Transaction/Transaction";

export interface ITradingService {
    executeBuyOrder(
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction>;
    executeSellOrder(
        userId: string,
        symbol: string,
        quantity: number
    ): Promise<Transaction>;
    getTransactionHistory(userId: string): Transaction[];
}
export enum typeTransaction {buy, sell}