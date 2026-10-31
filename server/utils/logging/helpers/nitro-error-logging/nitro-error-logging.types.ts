import type { H3Event } from "h3";

/**
 * Nitro error-hook context reduced to the request event.
 */
type NitroErrorLoggingContext = {
  /** Request event associated with the failure, when Nitro provides one. */
  event?: H3Event;
};

export type { NitroErrorLoggingContext };