/**
 * Discriminated result of an asynchronous action that fails without throwing.
 *
 * - `{ ok: true; value }` — the current request succeeded.
 * - `{ ok: false; error }` — the current request failed.
 * - `{ ok: false; superseded: true }` — a newer request replaced this one before it settled.
 *
 * A `superseded` result means "do nothing": no toast, no flag write, no state write.
 * Narrow with `if (!result.ok) { if (result.superseded === true) { … } … }`. The `superseded?: false`
 * member of the failure variant keeps `result.superseded` readable on the union while the
 * third variant has no `error` field, so TypeScript rejects unguarded `result.error` accesses.
 */
type AsyncResult<TResult> =
  | { ok: true; value: TResult } |
  { ok: false; error: unknown; superseded?: false } |
  { ok: false; superseded: true };

export type { AsyncResult };