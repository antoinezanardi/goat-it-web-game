import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import OfflinePage from "@/pages/offline/index.vue";

describe("Offline Page", () => {
  let wrapper: VueWrapper;

  async function mountOfflinePage(options: MountSuspendedOptions<typeof OfflinePage> = {}): Promise<VueWrapper> {
    return mountSuspended(OfflinePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountOfflinePage();
  });

  it("should render Offline Page when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the offline notice container when mounted.", () => {
    expect(wrapper.find("[data-testid='offline-page']").exists()).toBeTruthy();
  });

  it("should render the offline title translation key when mounted.", () => {
    expect(wrapper.find("[data-testid='offline-page-title']").text()).toBe("offline.title");
  });

  it("should render the offline description translation key when mounted.", () => {
    expect(wrapper.find("[data-testid='offline-page-description']").text()).toBe("offline.description");
  });

  it("should render the retry link label translation key when mounted.", () => {
    expect(wrapper.find("[data-testid='offline-retry-link']").text()).toBe("offline.retry");
  });

  it("should reload the current URL from the retry link when mounted.", () => {
    expect(wrapper.find("[data-testid='offline-retry-link']").attributes("href")).toBe("");
  });

  it("should render the wifi-off icon when mounted.", () => {
    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-wifi-off");
  });
});