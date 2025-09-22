import { User } from "../../models/User/User";
import {IUserRepository} from "../repositories/IUserRepository";
import {storage} from "../../utils/storage";
import {BaseRepository} from "../BaseRepository";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  protected getNotFoundMessage(id: string): string {
    return "Usuario no encontrado";
  }
  findById(id: string): User | null {
    return storage.getUserById(id) ?? null;
  }
}
