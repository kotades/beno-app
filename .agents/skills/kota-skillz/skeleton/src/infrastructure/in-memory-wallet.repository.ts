import { IWalletRepository } from "../application/wallet-repository.interface";
import { Wallet } from "../domain/wallet";
import { Result, ok, fail } from "../shared/result";

export class InMemoryWalletRepository implements IWalletRepository {
  private wallets: Map<string, Wallet> = new Map();

  public async findById(id: string): Promise<Result<Wallet, Error>> {
    const wallet = this.wallets.get(id);
    if (!wallet) return fail(new Error("Wallet not found"));
    return ok(wallet);
  }

  public async update(wallet: Wallet): Promise<Result<void, Error>> {
    this.wallets.set(wallet.id, wallet);
    return ok(undefined);
  }

  public async atomicIncrement(id: string, amount: number): Promise<Result<void, Error>> {
    const wallet = this.wallets.get(id);
    if (!wallet) return fail(new Error("Wallet not found"));
    wallet.deposit(amount);
    return ok(undefined);
  }

  public async lock(id: string): Promise<Result<Wallet, Error>> {
    // In-memory simulation: just return the object.
    // In a real DB, this would be SELECT ... FOR UPDATE
    return this.findById(id);
  }

  // Helper for seeding data in demo
  public seed(wallet: Wallet) {
    this.wallets.set(wallet.id, wallet);
  }
}
