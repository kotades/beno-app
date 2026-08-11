import { User } from "../domain/user";
import { UserRepository } from "../application/user-repository.interface";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
    console.log(`[Infrastructure] User ${user.email} saved to In-Memory DB.`);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  nextId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
