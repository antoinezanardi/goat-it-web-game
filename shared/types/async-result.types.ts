/**
 * Discriminated result of an operation that fails without throwing.
 *
 * The `ok: true` branch carries `value`; the `ok: false` branch carries the original `error`.
 */
type AsyncResult<TResult> =
  | { ok: true; value: TResult } |
  { ok: false; error: unknown };

export type { AsyncResult };