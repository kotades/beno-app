import { generateId } from "../shared/id-generator";
import { Result, ok, fail } from "../shared/result";
import { ValidationError } from "../shared/errors";

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
}

export class User {
  private constructor(private props: UserProps) {
    if (!this.props.id) {
      this.props.id = generateId();
    }
  }

  public static create(props: UserProps): Result<User, ValidationError> {
    const validation = this.validate(props);
    if (validation.isFailure) {
      return fail(validation.error);
    }
    return ok(new User(props));
  }

  private static validate(props: UserProps): Result<void, ValidationError> {
    if (!props.email.includes("@")) {
      return fail(new ValidationError("Invalid email address"));
    }
    if (props.name.length < 2) {
      return fail(new ValidationError("Name too short"));
    }
    return ok(undefined);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
}
