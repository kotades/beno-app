import { User } from "../domain/user";

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  nextId(): string;
}
