import { generateId } from "../shared/id-generator";
import { Result, ok, fail } from '../shared/result';

export class Wallet {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    private _balance: number // in cents/kobo
  ) {}

  public static create(userId: string, initialBalance: number = 0, id?: string): Wallet {
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative");
    }
    return new Wallet(id || generateId(), userId, initialBalance);
  }

  get balance(): number {
    return this._balance;
  }

  public deposit(amount: number): Result<void, Error> {
    if (amount <= 0) {
      return fail(new Error("Deposit amount must be positive"));
    }
    this._balance += amount;
    return ok(undefined);
  }

  public withdraw(amount: number): Result<void, Error> {
    if (amount <= 0) {
      return fail(new Error("Withdrawal amount must be positive"));
    }
    if (this._balance < amount) {
      return fail(new Error("Insufficient funds"));
    }
    this._balance -= amount;
    return ok(undefined);
  }
}
