/**
 * Sends one caught client failure to the configured error tracker.
 */
type ClientErrorCapture = (error: unknown) => void;

export type { ClientErrorCapture };