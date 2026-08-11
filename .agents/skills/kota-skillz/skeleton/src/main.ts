import { InMemoryUserRepository } from "./infrastructure/in-memory-user.repository";
import { SignupUseCase } from "./application/signup.use-case";
import { UserController } from "./interface/user.controller";
import { ConsoleLogger } from "./shared/logger";
import { BcryptHasher } from "./shared/password-hasher";
import { InMemoryWalletRepository } from "./infrastructure/in-memory-wallet.repository";
import { Wallet } from "./domain/wallet";
import { TransferFundsUseCase } from "./application/transfer-funds.use-case";
import { WalletController } from "./interface/wallet.controller";

async function main() {
  const logger = new ConsoleLogger();
  const hasher = new BcryptHasher();
  
  logger.info("--- Initializing Industrial Security-First Skeleton ---");

  // 1. Setup User Module
  const userRepository = new InMemoryUserRepository();
  const signupUseCase = new SignupUseCase(userRepository, hasher, logger);
  const userController = new UserController(signupUseCase);

  // 2. Setup Wallet Module
  const walletRepository = new InMemoryWalletRepository();
  const transferUseCase = new TransferFundsUseCase(walletRepository, logger);
  const walletController = new WalletController(transferUseCase);

  // --- DEMO FLOW: Secure Signup ---
  logger.info("\n[Demo] 1. Secure Signup with BCrypt (ASVS v2.4)");
  const signupRequest = {
    body: {
      name: "Sanni Secure",
      email: "sanni@secure.com",
      password: "strong_password_123" // Raw password passed to controller
    }
  };

  const signupResponse = await userController.signup(signupRequest);
  const userId = (signupResponse.body as any).userId;
  logger.info(`[Demo] User Created with UUID: ${userId}`);

  // --- DEMO FLOW: Secure Wallet & Ownership (ASVS v4.1) ---
  logger.info("\n[Demo] 2. Wallet Ownership & Transactional Safety");
  
  // Seed wallets with UUIDs
  const userA_Id = userId;
  const userB_Id = "d7b1b3b1-4b1b-4b1b-4b1b-4b1b4b1b4b1b"; // Attacker/Other user
  
  const walletA = Wallet.create(userA_Id, 5000); // $50.00
  const walletB = Wallet.create(userB_Id, 1000); // $10.00
  
  walletRepository.seed(walletA);
  walletRepository.seed(walletB);

  logger.info(`[Demo] WalletA ID: ${walletA.id} (Owner: ${userA_Id})`);
  logger.info(`[Demo] WalletB ID: ${walletB.id} (Owner: ${userB_Id})`);

  // Scenario A: Successful Authorized Transfer
  logger.info("\n[Demo] Scenario A: Valid Transfer ($20.00) from UserA");
  const validTransfer = {
    headers: { 'x-user-id': userA_Id }, // Authorized as UserA
    body: {
      fromWalletId: walletA.id,
      toWalletId: walletB.id,
      amount: 2000
    }
  };
  const validRes = await walletController.transfer(validTransfer);
  logger.info(`[Demo] Response: ${JSON.stringify(validRes, null, 2)}`);

  // Scenario B: Unauthorized Transfer (IDOR attempt)
  logger.info("\n[Demo] Scenario B: Attacker tries to steal from WalletA (ASVS v4.1)");
  const attackerTransfer = {
    headers: { 'x-user-id': userB_Id }, // Logged in as UserB
    body: {
      fromWalletId: walletA.id, // Trying to withdraw from WalletA
      toWalletId: walletB.id,
      amount: 3000
    }
  };
  const attackerRes = await walletController.transfer(attackerTransfer);
  logger.info(`[Demo] Response (Expected 403): ${JSON.stringify(attackerRes, null, 2)}`);

  logger.info("\n--- Security Verification Finished ---");
}

main().catch(console.error);
