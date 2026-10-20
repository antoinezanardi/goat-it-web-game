type AsyncResult<TResult> =
  | { ok: true; value: TResult } |
  { ok: false; error: unknown };

export type { AsyncResult };