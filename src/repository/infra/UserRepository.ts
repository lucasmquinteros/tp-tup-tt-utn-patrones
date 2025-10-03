import { User } from "../../models/User/User";
import { BaseRepository } from "../BaseRepository";
import { riskLevel } from "../../services/MarketAnalysisService/RiskGenerator";

export class UserRepository
  extends BaseRepository<User>
{
  private static instance: UserRepository;

  private constructor() {
    super();
  }
  static getInstance() {
    if (UserRepository.instance) return UserRepository.instance;
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
    defaultUsers.forEach((user) => this.entities.set(user.id, user));
  }

  protected getNotFoundMessage(id: string): string {
    return "Usuario no encontrado";
  }

  findByApiKey(apiKey: string): User | null {
    return (
      Array.from(this.entities.values()).find(
        (user) => user.apiKey === apiKey
      ) || null
    );
  }

  getAllUsers(): User[] {
    return Array.from(this.entities.values());
  }

  updateUser(user: User): void {
    this.entities.set(user.id, user);
  }
}
