import { SignupUseCase, SignupRequest } from "../application/signup.use-case";

export class UserController {
  constructor(private signupUseCase: SignupUseCase) {}

  async signup(httpRequest: any) {
    const { name, email, password } = httpRequest.body;
    
    // Data translation (Humble Object logic)
    const signupRequest: SignupRequest = {
      name,
      email,
      password,
    };

    const result = await this.signupUseCase.execute(signupRequest);

    if (result.isFailure) {
      const error = result.error;
      let statusCode = 500;

      if (error.code === "VALIDATION_ERROR") statusCode = 400;
      if (error.code === "CONFLICT_ERROR") statusCode = 409;

      return {
        statusCode,
        body: { 
          error: error.message,
          code: error.code
        },
      };
    }

    return {
      statusCode: 201,
      body: result.value,
    };
  }
}
