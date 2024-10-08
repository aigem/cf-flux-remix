export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    console.error(`[${error.statusCode}] ${error.message}`);
    return json({ error: error.message }, { status: error.statusCode });
  }
  console.error("Unexpected error:", error);
  return json({ error: "Internal Server Error" }, { status: 500 });
}