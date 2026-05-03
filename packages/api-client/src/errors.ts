import type { ApiErrorBody } from "./types.ts";

export class ApiError extends Error {
  readonly httpStatus: number;
  readonly status: string;
  readonly detail?: string;

  constructor(httpStatus: number, body: ApiErrorBody) {
    super(body.error ?? body.status);
    this.name = "ApiError";
    this.httpStatus = httpStatus;
    this.status = body.status;
    this.detail = body.error;
  }
}

export class ApiNetworkError extends Error {
  constructor(cause: unknown) {
    super("Network request failed", { cause });
    this.name = "ApiNetworkError";
  }
}
