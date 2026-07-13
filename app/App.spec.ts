import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import App from "@/App.vue";

let fetchAndStoreQuestionThemesMock: Mock<() => Promise<void>>;

mockNuxtImport("useQuestionThemesStore", () => (): { fetchAndStoreQuestionThemes: Mock<() => Promise<void>> } => ({
  fetchAndStoreQuestionThemes: fetchAndStoreQuestionThemesMock,
}));

describe("App Component", () => {
  let wrapper: VueWrapper;

  async function mountAppComponent(options: MountSuspendedOptions<typeof App> = {}): Promise<VueWrapper> {
    return mountSuspended(App, { shallow: true, ...options });
  }

  beforeEach(async() => {
    fetchAndStoreQuestionThemesMock = vi.fn<() => Promise<void>>();
    wrapper = await mountAppComponent();
  });

  it("should render UApp component when mounted.", () => {
    expect(wrapper.findComponent({ name: "App" }).exists()).toBeTruthy();
  });

  it("should render NuxtPage component when mounted.", () => {
    expect(wrapper.findComponent({ name: "NuxtPage" }).exists()).toBeTruthy();
  });

  it("should call callOnce with fetchAndStoreQuestionThemes when mounted.", () => {
    expect(callOnce).toHaveBeenCalledExactlyOnceWith(fetchAndStoreQuestionThemesMock, expect.any(String) as unknown);
  });
});