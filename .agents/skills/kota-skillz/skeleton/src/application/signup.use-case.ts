import { User } from "../domain/user";
import { UserRepository } from "./user-repository.interface";
import { Result, ok, fail } from "../shared/result";
import { ApplicationError, ConflictError, ValidationError } from "../shared/errors";
import { Logger } from "../shared/logger";
import { IPasswordHasher } from "../shared/password-hasher";

export interface SignupRequest {
  name: string;
  email: string;
  password: string; // ASVS: Expect raw password, hash it here
}

export interface SignupResponse {
  userId: string;
  success: boolean;
}

export class SignupUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: IPasswordHasher,
    private logger: Logger
  ) {}

  async execute(request: SignupRequest): Promise<Result<SignupResponse, ApplicationError | ValidationError>> {
    this.logger.info("Starting signup use case", { email: request.email });

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      this.logger.warn("Signup failed: User already exists", { email: request.email });
      return fail(new ConflictError("User already exists"));
    }

    // 2. Hash Password (ASVS v2.4)
    const passwordHash = await this.passwordHasher.hash(request.password);

    // 3. Create Entity (Handles its own UUID)
    const userResult = User.create({
      name: request.name,
      email: request.email,
      passwordHash: passwordHash,
    });

    if (userResult.isFailure) {
      return fail(userResult.error);
    }

    const user = userResult.value;

    // 4. Save to repository
    await this.userRepository.save(user);

    this.logger.info("Signup successful", { userId: user.id });

    return ok({
      userId: user.id!,
      success: true,
    });
  }
}
