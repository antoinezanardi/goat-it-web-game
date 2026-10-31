/**
 * Response body returned by the readiness probe.
 */
type ReadinessResponse = {
  /** Readiness marker derived from the Goat It API health check. */
  status: "ready" | "not_ready";
};

export type { ReadinessResponse };