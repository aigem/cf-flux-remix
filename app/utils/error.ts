import { json } from "@remix-run/cloudflare";

export class AppError extends Error {
  constructor(public message: string, public status: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown) {
  console.error(error);
  if (error instanceof AppError) {
    return json({ error: error.message }, { status: error.status });
  }
  return json({ error: "An unexpected error occurred" }, { status: 500 });
}