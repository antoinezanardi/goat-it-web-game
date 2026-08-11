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

  describe("useHead", () => {
    type AppHeadConfig = {
      link: { rel: string; href: string }[];
      meta: { name: string; content: string }[];
    };

    function getAppHeadConfig(): AppHeadConfig | undefined {
      return vi.mocked(useHead).mock.calls[0]?.[0] as AppHeadConfig | undefined;
    }

    it("should call useHead with a link to the web manifest when mounted.", () => {
      expect(getAppHeadConfig()?.link[0]).toStrictEqual({ rel: "manifest", href: "/manifest.webmanifest" });
    });

    it("should call useHead with an apple touch icon link when mounted.", () => {
      expect(getAppHeadConfig()?.link[1]).toStrictEqual({ rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png" });
    });

    it("should call useHead with a theme-color meta when mounted.", () => {
      expect(getAppHeadConfig()?.meta[0]).toStrictEqual({ name: "theme-color", content: "#18181b" });
    });

    it("should call useHead with a mobile-web-app-capable meta when mounted.", () => {
      expect(getAppHeadConfig()?.meta[1]).toStrictEqual({ name: "mobile-web-app-capable", content: "yes" });
    });
  });

  describe("defineOgImage", () => {
    it("should call defineOgImage with the correct component when mounted.", () => {
      const defineOgImageMock = vi.mocked(defineOgImage);

      expect(defineOgImageMock).toHaveBeenCalledExactlyOnceWith("Image.takumi");
    });
  });
});