import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { StatusScreen } from "#components";

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

  it("should render StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).exists()).toBeTruthy();
  });

  it("should pass the offline title key to StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).props("title")).toBe("offline.title");
  });

  it("should pass the offline description key to StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).props("description")).toBe("offline.description");
  });

  it("should pass the wifi-off icon to StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).props("icon")).toBe("i-lucide-wifi-off");
  });

  describe("when fully mounted", () => {
    beforeEach(async() => {
      wrapper = await mountOfflinePage({ shallow: false });
    });

    it("should render the offline page root test id when mounted.", () => {
      expect(wrapper.find("[data-testid='offline-page']").exists()).toBeTruthy();
    });

    it("should render the offline title test id when mounted.", () => {
      expect(wrapper.find("[data-testid='offline-page-title']").text()).toBe("offline.title");
    });

    it("should render the offline description test id when mounted.", () => {
      expect(wrapper.find("[data-testid='offline-page-description']").text()).toBe("offline.description");
    });

    it("should render the retry link label translation key when mounted.", () => {
      expect(wrapper.find("[data-testid='offline-retry-link']").text()).toBe("offline.retry");
    });

    it("should reload the current URL from the retry link when mounted.", () => {
      expect(wrapper.find("[data-testid='offline-retry-link']").attributes("href")).toBe("");
    });
  });
});