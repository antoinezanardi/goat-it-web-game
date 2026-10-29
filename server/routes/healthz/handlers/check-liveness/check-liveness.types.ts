/**
 * Response body returned by the liveness probe.
 */
type LivenessResponse = {
  /** Liveness marker returned when the Nitro process is serving requests. */
  status: "ok";
};

export type { LivenessResponse };