import {User} from "../../models/User/User";
import {IUserRepository} from "../repositories/IUserRepository";
import {BaseRepository} from "../BaseRepository";
import {riskLevel} from "../../services/MarketAnalysisService/RiskGenerator";

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  private users: Map<string, User> = new Map();
  private static instance: UserRepository;

  private constructor() {
    super();
  }
  static getInstance() {
    if(UserRepository.instance) return UserRepository.instance;
    return new UserRepository();
  }

  initializeDefaultData() {
    const defaultUsers = [
      new User(
        "demo_user",
        "demo_user",
        "demo@example.com",
        "demo-key-123",
        10000.0,
        riskLevel.medium
      ),
      new User(
        "admin_user",
        "admin_user",
        "admin@example.com",
        "admin-key-456",
        50000.0,
        riskLevel.high
      ),
      new User(
        "trader_user",
        "trader_user",
        "trader@example.com",
        "trader-key-789",
        25000.0,
        riskLevel.low
      ),
    ];
    defaultUsers.forEach((user) => this.users.set(user.id, user));
  }

  protected getNotFoundMessage(id: string): string {
    return "Usuario no encontrado";
  }
  findById(id: string): User | null {
    return this.users.get(id) || null;
  }

  findByApiKey(apiKey: string): User | null {
    return (
      Array.from(this.users.values()).find(
        (user) => user.apiKey === apiKey
      ) || null
    );
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(user: User): void {
    this.users.set(user.id, user);
  }
}
