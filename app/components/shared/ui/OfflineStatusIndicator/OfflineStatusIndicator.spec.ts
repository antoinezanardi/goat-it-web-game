import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { useNetworkMock } from "~~/tests/unit/setup/nuxt/composables/use-network.nuxt.unit-setup";

import { OfflineStatusIndicator } from "#components";

describe("OfflineStatusIndicator Component", () => {
  let wrapper: VueWrapper;

  async function mountOfflineStatusIndicator(options: MountSuspendedOptions<typeof OfflineStatusIndicator> = {}): Promise<VueWrapper> {
    return mountSuspended(OfflineStatusIndicator, { ...options });
  }

  async function setOnline(isOnline: boolean): Promise<void> {
    useNetworkMock.instance.isOnlineRef.value = isOnline;
    await nextTick();
  }

  beforeEach(async() => {
    vi.useFakeTimers();
    useNetworkMock.instance.isOnlineRef.value = true;
    wrapper = await mountOfflineStatusIndicator();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render OfflineStatusIndicator when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should not render the status chip when mounted while online.", () => {
    expect(wrapper.find("[data-testid='connectivity-status']").exists()).toBe(false);
  });

  it("should render the status chip when the browser goes offline.", async() => {
    await setOnline(false);

    expect(wrapper.find("[data-testid='connectivity-status']").exists()).toBe(true);
  });

  it("should render the offline label translation key when the browser goes offline.", async() => {
    await setOnline(false);

    expect(wrapper.find("[data-testid='connectivity-status']").text()).toContain("common.connectivity.offline");
  });

  it("should render the wifi-off icon when the browser goes offline.", async() => {
    await setOnline(false);

    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-wifi-off");
  });

  it("should expose the icon test id when the browser goes offline.", async() => {
    await setOnline(false);

    expect(wrapper.find("[data-testid='connectivity-status-icon']").exists()).toBe(true);
  });

  it("should bind the wifi-off icon attribute when the browser goes offline.", async() => {
    await setOnline(false);

    expect(wrapper.get("[data-testid='connectivity-status-icon']").attributes("data-icon-name")).toBe("i-lucide-wifi-off");
  });

  it("should render the icon with the error color when the browser goes offline.", async() => {
    await setOnline(false);

    expect(wrapper.findComponent({ name: "UIcon" }).classes()).toContain("text-error");
  });

  it("should render the icon with the success color when connectivity returns.", async() => {
    await setOnline(false);
    await setOnline(true);

    expect(wrapper.findComponent({ name: "UIcon" }).classes()).toContain("text-success");
  });

  it("should switch to the online label when connectivity returns.", async() => {
    await setOnline(false);
    await setOnline(true);

    expect(wrapper.find("[data-testid='connectivity-status']").text()).toContain("common.connectivity.online");
  });

  it("should render the wifi icon when connectivity returns.", async() => {
    await setOnline(false);
    await setOnline(true);

    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-wifi");
  });

  it("should bind the wifi icon attribute when connectivity returns.", async() => {
    await setOnline(false);
    await setOnline(true);

    expect(wrapper.get("[data-testid='connectivity-status-icon']").attributes("data-icon-name")).toBe("i-lucide-wifi");
  });

  it("should expose a polite status live region when the chip is displayed.", async() => {
    await setOnline(false);
    const chip = wrapper.find("[data-testid='connectivity-status']");

    expect({ role: chip.attributes("role"), live: chip.attributes("aria-live") }).toStrictEqual({ role: "status", live: "polite" });
  });
});