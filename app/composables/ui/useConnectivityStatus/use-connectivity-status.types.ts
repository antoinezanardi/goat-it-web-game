import type { ComputedRef } from "vue";

type ConnectivityStatus = "offline" | "online";

/**
 * Connectivity chip contract returned by `useConnectivityStatus`.
 */
type UseConnectivityStatus = {
  /** Status to display; `undefined` before client mount and after the reconnect confirmation expires. */
  visibleStatus: ComputedRef<ConnectivityStatus | undefined>;
};

export type { ConnectivityStatus, UseConnectivityStatus };