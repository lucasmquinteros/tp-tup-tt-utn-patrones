import {User} from "../models/User/User";
import {Asset} from "../models/Asset/Asset";

export class Validator {
    static validateSymbol(symbol: string) {
        if (!symbol) {
            throw new Error("El símbolo del activo es requerido");
        }
    }

    static validateQuantity(quantity: number) {
        if (!quantity || quantity <= 0) {
            throw new Error("La cantidad debe ser un número mayor a 0");
        }
    }
    static validatePrice(price: number) {
        if(price <= 0){
            throw new Error("Precio invalido")
        }
    }


}