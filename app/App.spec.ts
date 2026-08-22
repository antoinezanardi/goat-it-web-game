import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect, beforeEach, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";

import App from "@/App.vue";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";
import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "~/app.constants";

describe("App Component", () => {
  let wrapper: VueWrapper;

  async function mountAppComponent(options: MountSuspendedOptions<typeof App> = {}): Promise<VueWrapper> {
    return mountSuspended(App, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountAppComponent({ plugins: [createTestingPinia()] });
    mockStore(useQuestionThemesStore);
  });

  it("should render App when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render UApp component when mounted.", () => {
    expect(wrapper.findComponent({ name: "App" }).exists()).toBeTruthy();
  });

  it("should render NuxtPage component when mounted.", () => {
    expect(wrapper.findComponent({ name: "NuxtPage" }).exists()).toBeTruthy();
  });

  describe("Nuxt UI App", () => {
    it.each<[string, typeof APP_TOAST_CONFIG | typeof APP_TOOLTIP_CONFIG]>([
      ["toaster", APP_TOAST_CONFIG],
      ["tooltip", APP_TOOLTIP_CONFIG],
    ])("should pass the %s config prop to the Nuxt UI App component when mounted.", (propertyName, config) => {
      const nuxtUIApp = wrapper.getComponent({ name: "App" });

      expect(nuxtUIApp.props(propertyName)).toStrictEqual(config);
    });
  });

  describe("useHead", () => {
    type AppHeadConfig = {
      link: Record<string, unknown>[];
      meta: Record<string, unknown>[];
    };

    function getAppHeadConfig(): AppHeadConfig | undefined {
      return vi.mocked(useHead).mock.calls[0]?.[0] as AppHeadConfig | undefined;
    }

    it.each<{ selector: "link" | "meta"; index: number; entry: Record<string, unknown> }>([
      { selector: "link", index: 0, entry: { rel: "manifest", href: "/manifest.webmanifest" } },
      { selector: "link", index: 1, entry: { rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png" } },
      { selector: "link", index: 2, entry: { rel: "preload", href: "/fonts/Geist/geist-latin.woff2", as: "font", type: "font/woff2", crossorigin: "" } },
      { selector: "meta", index: 0, entry: { name: "theme-color", content: "#09090b" } },
      { selector: "meta", index: 1, entry: { name: "mobile-web-app-capable", content: "yes" } },
    ])("should call useHead with the correct $selector entry at index $index when mounted.", ({ selector, index, entry }) => {
      expect(getAppHeadConfig()?.[selector][index]).toStrictEqual(entry);
    });
  });

  describe("defineOgImage", () => {
    it("should call defineOgImage with the correct component when mounted.", () => {
      const defineOgImageMock = vi.mocked(defineOgImage);

      expect(defineOgImageMock).toHaveBeenCalledExactlyOnceWith("Image.takumi");
    });
  });
});