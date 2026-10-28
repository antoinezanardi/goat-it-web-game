import { useMounted, useNetwork, useTimeoutFn } from "@vueuse/core";

import { CONNECTIVITY_ONLINE_STATUS_DURATION_MS } from "@/composables/ui/useConnectivityStatus/use-connectivity-status.constants";
import type { ConnectivityStatus, UseConnectivityStatus } from "@/composables/ui/useConnectivityStatus/use-connectivity-status.types";

/**
 * Tracks the browser connectivity signal and decides which status chip the app shows.
 *
 * Offline stays visible while the browser reports offline; online is shown for
 * `CONNECTIVITY_ONLINE_STATUS_DURATION_MS` after a reconnect, then hidden. Nothing is exposed before client
 * mount, so server-rendered markup stays neutral. The signal reflects browser connectivity only: it does not
 * prove that the Goat It API is reachable.
 */
function useConnectivityStatus(): UseConnectivityStatus {
  const { isOnline } = useNetwork();
  const isMounted = useMounted();
  const status = ref<ConnectivityStatus | undefined>(undefined);
  const visibleStatus = computed<ConnectivityStatus | undefined>(() => (isMounted.value ? status.value : undefined));
  const { start: startOnlineStatusTimer, stop: stopOnlineStatusTimer } = useTimeoutFn(
    () => {
      status.value = undefined;
    },
    CONNECTIVITY_ONLINE_STATUS_DURATION_MS,
    { immediate: false },
  );

  watch(isOnline, (online: boolean) => {
    stopOnlineStatusTimer();

    if (online) {
      status.value = "online";
      startOnlineStatusTimer();

      return;
    }
    status.value = "offline";
  }, { flush: "sync" });

  onMounted(() => {
    if (!isOnline.value) {
      status.value = "offline";
    }
  });

  return { visibleStatus };
}

export { useConnectivityStatus };