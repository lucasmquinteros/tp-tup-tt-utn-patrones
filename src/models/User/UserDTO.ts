import {User} from "./User";

export class UserDTO {
    static toPublic(user: User) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
            riskTolerance: user.riskTolerance,
            createdAt: user.createdAt,
        };
    }
}