import * as bcrypt from 'bcryptjs';

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export class BcryptHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 12; // ASVS requirement: >= 12

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
