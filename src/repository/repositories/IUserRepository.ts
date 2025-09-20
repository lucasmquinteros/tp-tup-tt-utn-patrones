import {User} from "../../models/User/User";
import {BaseRepository} from "../BaseRepository";
export interface IUserRepository extends BaseRepository<User>{
    getOneById(id: string): Promise<User | null>;
}

