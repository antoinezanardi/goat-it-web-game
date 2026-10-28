import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import type { UseNetworkReturn } from "@vueuse/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import type { Ref } from "vue";

import { createUseNetworkMock, createUseNetworkReturn } from "~~/tests/unit/utils/mocks/composables/core/useNetwork/useNetwork.mock";
import type { UseNetworkMock } from "~~/tests/unit/utils/mocks/composables/core/useNetwork/useNetwork.mock";

import type { useConnectivityStatus as UseConnectivityStatusType } from "@/composables/ui/useConnectivityStatus/useConnectivityStatus";
import { CONNECTIVITY_ONLINE_STATUS_DURATION_MS } from "@/composables/ui/useConnectivityStatus/use-connectivity-status.constants";
import type { UseConnectivityStatus } from "@/composables/ui/useConnectivityStatus/use-connectivity-status.types";

let useNetworkMock: UseNetworkMock;
let isMountedReference: Ref<boolean>;
let connectivityStatus: UseConnectivityStatus;
let useConnectivityStatus: typeof UseConnectivityStatusType;

mockNuxtImport("useNetwork", () => (): UseNetworkReturn => createUseNetworkReturn(useNetworkMock));
mockNuxtImport("useMounted", () => (): Ref<boolean> => isMountedReference);

function mountConnectivityHarness(): VueWrapper {
  return mount(defineComponent({
    setup(): () => null {
      connectivityStatus = useConnectivityStatus();

      return (): null => null;
    },
  }));
}

async function setMounted(): Promise<void> {
  isMountedReference.value = true;
  await nextTick();
}

async function setOnline(isOnline: boolean): Promise<void> {
  useNetworkMock.isOnlineRef.value = isOnline;
  await nextTick();
}

describe("useConnectivityStatus", () => {
  beforeEach(async() => {
    vi.useFakeTimers();
    useNetworkMock = createUseNetworkMock();
    isMountedReference = ref<boolean>(false);
    ({ useConnectivityStatus } = await import("@/composables/ui/useConnectivityStatus/useConnectivityStatus"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not expose a status when the component has not mounted yet.", async() => {
    mountConnectivityHarness();
    await setOnline(false);

    expect(connectivityStatus.visibleStatus.value).toBeUndefined();
  });

  it("should expose the offline status when mounted while offline.", async() => {
    useNetworkMock.isOnlineRef.value = false;
    mountConnectivityHarness();
    await setMounted();

    expect(connectivityStatus.visibleStatus.value).toBe("offline");
  });

  it("should expose the offline status when connectivity drops after mount.", async() => {
    mountConnectivityHarness();
    await setMounted();
    await setOnline(false);

    expect(connectivityStatus.visibleStatus.value).toBe("offline");
  });

  it("should expose the online status when connectivity returns after mount.", async() => {
    useNetworkMock.isOnlineRef.value = false;
    mountConnectivityHarness();
    await setMounted();
    await setOnline(true);

    expect(connectivityStatus.visibleStatus.value).toBe("online");
  });

  it("should hide the online status after the confirmation duration when connectivity returns.", async() => {
    useNetworkMock.isOnlineRef.value = false;
    mountConnectivityHarness();
    await setMounted();
    await setOnline(true);
    vi.advanceTimersByTime(CONNECTIVITY_ONLINE_STATUS_DURATION_MS);

    expect(connectivityStatus.visibleStatus.value).toBeUndefined();
  });

  it("should keep the offline status visible after the confirmation duration when still offline.", async() => {
    useNetworkMock.isOnlineRef.value = false;
    mountConnectivityHarness();
    await setMounted();
    await setOnline(false);
    vi.advanceTimersByTime(CONNECTIVITY_ONLINE_STATUS_DURATION_MS);

    expect(connectivityStatus.visibleStatus.value).toBe("offline");
  });

  it("should return to the offline status when connectivity drops during the online confirmation.", async() => {
    useNetworkMock.isOnlineRef.value = false;
    mountConnectivityHarness();
    await setMounted();
    await setOnline(true);
    vi.advanceTimersByTime(CONNECTIVITY_ONLINE_STATUS_DURATION_MS / 2);
    await setOnline(false);
    vi.advanceTimersByTime(CONNECTIVITY_ONLINE_STATUS_DURATION_MS);

    expect(connectivityStatus.visibleStatus.value).toBe("offline");
  });
});