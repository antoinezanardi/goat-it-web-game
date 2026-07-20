import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import App from "@/App.vue";
import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "~/app.constants";

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

  describe("Nuxt UI App", () => {
    it("should pass toaster props to the Nuxt UI App component when mounted.", () => {
      const nuxtUIApp = wrapper.getComponent({ name: "App" });

      expect(nuxtUIApp.props("toaster")).toStrictEqual(APP_TOAST_CONFIG);
    });

    it("should pass tooltip props to the Nuxt UI App component when mounted.", () => {
      const nuxtUIApp = wrapper.getComponent({ name: "App" });

      expect(nuxtUIApp.props("tooltip")).toStrictEqual(APP_TOOLTIP_CONFIG);
    });
  });
});