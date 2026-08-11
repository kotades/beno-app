import { TransferFundsUseCase, TransferFundsRequest } from "../application/transfer-funds.use-case";

export class WalletController {
  constructor(private transferFundsUseCase: TransferFundsUseCase) {}

  async transfer(httpRequest: any) {
    const { fromWalletId, toWalletId, amount } = httpRequest.body;
    const requestingUserId = httpRequest.headers['x-user-id']; // Simulated auth session

    const request: TransferFundsRequest = {
      fromWalletId,
      toWalletId,
      amount: Number(amount),
      requestingUserId
    };

    const result = await this.transferFundsUseCase.execute(request);

    if (result.tag === 'failure') {
      const error = result.error;
      let statusCode = 400; // Default to Bad Request for domain failures

      if (error.message.includes("Unauthorized")) {
        statusCode = 403; // Forbidden
      }

      if (error.message === "Insufficient funds") {
        statusCode = 402; // Payment Required
      }

      return {
        statusCode,
        body: {
          error: error.message,
          status: 'error'
        }
      };
    }

    return {
      statusCode: 200,
      body: {
        message: "Transfer successful",
        status: 'success'
      }
    };
  }
}
