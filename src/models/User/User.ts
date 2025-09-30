import {riskLevel} from "../../services/MarketAnalysisService/RiskGenerator";

export class User {
    id: string;
    username: string;
    email: string;
    apiKey: string;
    balance: number;
    riskTolerance: riskLevel;
    createdAt: Date;

    constructor(
        id: string,
        username: string,
        email: string,
        apiKey: string,
        balance: number,
        riskTolerance: riskLevel
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.apiKey = apiKey;
        this.balance = balance;
        this.riskTolerance = riskTolerance;
        this.createdAt = new Date();
    }

    canAfford(amount: number): boolean {
        return this.balance >= amount;
    }

    deductBalance(amount: number): void {
        this.balance -= amount;
    }

    addBalance(amount: number): void {
        this.balance += amount;
    }
}
