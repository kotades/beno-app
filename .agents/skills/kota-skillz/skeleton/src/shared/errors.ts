export abstract class BaseError extends Error {
  constructor(readonly message: string, readonly code: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DomainError extends BaseError {
  constructor(message: string, code = "DOMAIN_ERROR") {
    super(message, code);
  }
}

export class ApplicationError extends BaseError {
  constructor(message: string, code = "APPLICATION_ERROR") {
    super(message, code);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, "CONFLICT_ERROR");
  }
}
