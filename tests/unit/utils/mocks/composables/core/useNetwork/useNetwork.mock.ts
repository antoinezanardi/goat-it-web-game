import { computed, shallowRef } from "vue";
import type { ShallowRef } from "vue";
import type { NetworkEffectiveType, NetworkType, UseNetworkReturn } from "@vueuse/core";

type UseNetworkMock = {
  isOnlineRef: ShallowRef<boolean>;
};

function createUseNetworkMock(): UseNetworkMock {
  return { isOnlineRef: shallowRef<boolean>(true) };
}

function createUseNetworkReturn(mock: UseNetworkMock): UseNetworkReturn {
  return {
    isSupported: computed<boolean>(() => true),
    isOnline: mock.isOnlineRef,
    offlineAt: shallowRef<number | undefined>(),
    onlineAt: shallowRef<number | undefined>(),
    downlink: shallowRef<number | undefined>(),
    downlinkMax: shallowRef<number | undefined>(),
    effectiveType: shallowRef<NetworkEffectiveType | undefined>(),
    rtt: shallowRef<number | undefined>(),
    saveData: shallowRef<boolean | undefined>(false),
    type: shallowRef<NetworkType>("unknown"),
  };
}

export type { UseNetworkMock };

export { createUseNetworkMock, createUseNetworkReturn };