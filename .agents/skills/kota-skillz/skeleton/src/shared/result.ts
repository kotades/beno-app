export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

export interface Success<T, E> {
  readonly tag: "success";
  readonly isSuccess: true;
  readonly isFailure: false;
  readonly value: T;
}

export interface Failure<T, E> {
  readonly tag: "failure";
  readonly isSuccess: false;
  readonly isFailure: true;
  readonly error: E;
}

export const ok = <T, E>(value: T): Result<T, E> => ({
  tag: "success",
  isSuccess: true,
  isFailure: false,
  value,
});

export const fail = <T, E>(error: E): Result<T, E> => ({
  tag: "failure",
  isSuccess: false,
  isFailure: true,
  error,
});
