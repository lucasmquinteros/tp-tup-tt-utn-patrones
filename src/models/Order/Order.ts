import { IOrderBuilder } from "./IOrderBuilder";

export class Order {
  id: string;
  userId: string;
  type: "market";
  action: "buy" | "sell";
  symbol: string;
  quantity: number;
  price?: number;
  status: "pending" | "executed" | "cancelled";
  createdAt: Date;
  executedAt?: Date;

  public constructor(
    id: string,
    userId: string,
    type: "market",
    action: "buy" | "sell",
    symbol: string,
    quantity: number,
    price?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.action = action;
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.status = "pending";
    this.createdAt = new Date();
  }

  execute(): void {
    this.status = "executed";
    this.executedAt = new Date();
  }

  cancel(): void {
    this.status = "cancelled";
  }

  static builder(): 
  OrderBuilder {
    return new OrderBuilder();
  }
   static builder(): OrderBuilder {
    return new OrderBuilder();
  }

  // 👇 Builder ANIDADO dentro de Order
  static OrderBuilder = class {
    private id!: string;
    private userId!: string;
    private type: "market" = "market";
    private action!: "buy" | "sell";
    private symbol!: string;
    private quantity!: number;
    private price?: number;

    setId(id: string): this {
      this.id = id;
      return this;
    }

    setUserId(userId: string): this {
      this.userId = userId;
      return this;
    }

    setType(type: "market"): this {
      this.type = type;
      return this;
    }

    setAction(action: "buy" | "sell"): this {
      this.action = action;
      return this;
    }

    setSymbol(symbol: string): this {
      this.symbol = symbol;
      return this;
    }

    setQuantity(quantity: number): this {
      this.quantity = quantity;
      return this;
    }

    setPrice(price: number): this {
      this.price = price;
      return this;
    }

    // Métodos fluidos opcionales (mejor UX)
    to(action: "buy" | "sell"): this {
      this.action = action;
      return this;
    }

    forSymbol(symbol: string): this {
      this.symbol = symbol;
      return this;
    }

    withQuantity(quantity: number): this {
      this.quantity = quantity;
      return this;
    }

    atPrice(price: number): this {
      this.price = price;
      return this;
    }

    build(): Order {
      if (
        this.id == null ||
        this.userId == null ||
        this.action == null ||
        this.symbol == null ||
        this.quantity == null
      ) {
        throw new Error("Missing required fields to build Order");
      }

      // ✅ Ahora SÍ puede acceder al constructor privado
      return new Order(
        this.id,
        this.userId,
        this.type,
        this.action,
        this.symbol,
        this.quantity,
        this.price
      );
    }
  };
}