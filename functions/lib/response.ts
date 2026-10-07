import type { QeeperCtx } from "../types";

export const successPayload = (
  c: QeeperCtx,
  payload: Record<string, any>,
  statusCode: number = 200,
) => {
  return c.json(payload, statusCode);
}

export const errorPayload = (
  c: QeeperCtx,
  error: Record<string, any>,
) => {
  // Errors without a status (e.g. a failed KV write) are server errors.
  const statusCode = error.statusCode ?? 500;
  if (statusCode === 500) console.error(error);
  return c.json({ type: error.name, success: false, message: error.message }, statusCode);
}
