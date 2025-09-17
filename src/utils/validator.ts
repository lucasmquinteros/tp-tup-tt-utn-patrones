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
}