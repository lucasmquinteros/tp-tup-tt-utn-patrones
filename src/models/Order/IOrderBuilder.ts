import { Order } from "./Order";

export interface IOrderBuilder {
    setId(id: string): IOrderBuilder;
    setUserId(userId: string): IOrderBuilder;
    setType(type: "market"): IOrderBuilder;
    setAction(action: "buy" | "sell"): IOrderBuilder;
    setSymbol(symbol: string): IOrderBuilder;
    setQuantity(quantity: number): IOrderBuilder;
    setPrice(price: number): IOrderBuilder;
    build(): Order;
}