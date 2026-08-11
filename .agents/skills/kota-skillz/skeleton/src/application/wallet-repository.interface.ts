import { Wallet } from '../domain/wallet';
import { Result } from '../shared/result';

export interface IWalletRepository {
  findById(id: string): Promise<Result<Wallet, Error>>;
  update(wallet: Wallet): Promise<Result<void, Error>>;
  
  /**
   * Atomic increment to prevent lost updates at the DB level.
   * Uses UPDATE wallets SET balance = balance + amount WHERE id = id
   */
  atomicIncrement(id: string, amount: number): Promise<Result<void, Error>>;

  /**
   * Acquires a pessimistic lock on the wallet row.
   * Uses SELECT ... FOR UPDATE
   */
  lock(id: string): Promise<Result<Wallet, Error>>;
}
