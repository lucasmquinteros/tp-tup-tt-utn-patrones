import {storage} from "./storage";
import {Asset, User} from "../models/types";

export class Validator {
    static validateSymbol(symbol: string) {
        if (!symbol || typeof symbol !== "string") {
            throw new Error("El símbolo del activo es requerido");
        }
    }

    static validateQuantity(quantity: number) {
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            throw new Error("La cantidad debe ser un número mayor a 0");
        }
    }
    static getUser(userID: string): User{
        const user = storage.getUserById(userID);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }
    static getAsset(symbol: string): Asset{
        const asset = storage.getAssetBySymbol(symbol);
        if (!asset) {
            throw new Error("Activo no encontrado");
        }
        return asset;
    }
    static getPortafolio(userID: string): any{
        const portfolio = storage.getPortfolioByUserId(userID);
        if (!portfolio) {
            throw new Error("Portafolio no encontrado");
        }
        return portfolio;
    }
    static getHolding(portfolioID: string, symbol: string): any{
        const portfolio = storage.getPortfolioByUserId(portfolioID);
        if (!portfolio) {}
    }
}