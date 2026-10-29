/**
 * Cached result of one Goat It API readiness probe.
 */
type ReadinessCacheEntry = {
  /** Whether the upstream health endpoint answered successfully. */
  readonly isReady: boolean;
  /** Epoch milliseconds after which the cached result must be probed again. */
  readonly expiresAtInMs: number;
};

export type { ReadinessCacheEntry };