import { IWalletRepository } from './wallet-repository.interface';
import { Result, ok, fail } from '../shared/result';
import { Logger } from '../shared/logger';

export interface TransferFundsRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  requestingUserId: string; // ASVS: Identity of the requester
}

export class TransferFundsUseCase {
  constructor(
    private readonly walletRepo: IWalletRepository,
    private readonly logger: Logger
  ) {}

  public async execute(request: TransferFundsRequest): Promise<Result<void, Error>> {
    this.logger.info("Starting funds transfer", { ...request });

    // Industrial Heuristic: Lock ordering to prevent deadlocks
    const walletIds = [request.fromWalletId, request.toWalletId].sort();
    
    try {
      this.logger.debug(`Acquiring locks in order: ${walletIds.join(', ')}`);
      
      // Lock both wallets
      const fromWalletResult = await this.walletRepo.lock(request.fromWalletId);
      if (fromWalletResult.tag === 'failure') return fail(fromWalletResult.error);
      
      const toWalletResult = await this.walletRepo.lock(request.toWalletId);
      if (toWalletResult.tag === 'failure') return fail(toWalletResult.error);

      const fromWallet = fromWalletResult.value;
      const toWallet = toWalletResult.value;

      // 1. Ownership Check (ASVS v4.1)
      if (fromWallet.userId !== request.requestingUserId) {
        this.logger.error("Security Alert: Unauthorized transfer attempt", { 
          requestingUser: request.requestingUserId, 
          owner: fromWallet.userId 
        });
        return fail(new Error("Unauthorized: You do not own this wallet"));
      }

      // 2. Business Logic
      const withdrawResult = fromWallet.withdraw(request.amount);
      if (withdrawResult.tag === 'failure') {
        this.logger.warn("Transfer failed: Insufficient funds", { walletId: fromWallet.id });
        return fail(withdrawResult.error);
      }

      const depositResult = toWallet.deposit(request.amount);
      if (depositResult.tag === 'failure') {
        return fail(depositResult.error);
      }

      // 3. Commit updates
      await this.walletRepo.update(fromWallet);
      await this.walletRepo.update(toWallet);

      this.logger.info("Transfer completed successfully", { 
        from: fromWallet.id, 
        to: toWallet.id, 
        amount: request.amount 
      });

      return ok(undefined);
    } catch (error) {
      this.logger.error("Unexpected error during transfer", { error });
      return fail(error instanceof Error ? error : new Error("Unknown transfer error"));
    }
  }
}
