import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { useGoatItApiErrorToastMock } from "~~/tests/unit/setup/nuxt/composables/use-goat-it-api-error-toast.nuxt.unit-setup";
import { getRouteRulesMock } from "~~/tests/unit/setup/nuxt/use-route-rules.nuxt.unit-setup";

import App from "@/App.vue";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";
import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "@/app.constants";

describe("App Component", () => {
  let wrapper: VueWrapper;

  async function mountAppComponent(options: MountSuspendedOptions<typeof App> = {}): Promise<VueWrapper> {
    return mountSuspended(App, { shallow: true, ...options });
  }

  beforeEach(async() => {
    getRouteRulesMock.instance.mockReturnValue({});
    wrapper = await mountAppComponent({ global: { plugins: [createTestingPinia()] } });
    mockStore(useQuestionThemesStore).fetchAndStoreQuestionThemes.mockResolvedValue({ ok: true, value: [] });
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

  it("should render NuxtLayout component when mounted.", () => {
    expect(wrapper.findComponent({ name: "NuxtLayout" }).exists()).toBeTruthy();
  });

  it("should render UMain component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UMain" }).exists()).toBeTruthy();
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
      { selector: "link", index: 2, entry: { rel: "preload", href: "/fonts/Geist/geist-latin.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" } },
      { selector: "meta", index: 0, entry: { name: "theme-color", content: "#09090b" } },
      { selector: "meta", index: 1, entry: { name: "mobile-web-app-capable", content: "yes" } },
      { selector: "meta", index: 2, entry: { name: "apple-mobile-web-app-capable", content: "yes" } },
      { selector: "meta", index: 3, entry: { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" } },
      { selector: "meta", index: 4, entry: { name: "apple-mobile-web-app-title", content: "Goat It" } },
    ])("should call useHead with the correct $selector entry at index $index when mounted.", ({ selector, index, entry }) => {
      expect(getAppHeadConfig()?.[selector][index]).toStrictEqual(entry);
    });
  });

  describe("useSeoMeta", () => {
    type AppSeoMetaConfig = {
      meta: { name?: string; property?: string; content: () => string }[];
    };

    function getAppSeoMetaConfig(): AppSeoMetaConfig | undefined {
      return vi.mocked(useHead).mock.calls[1]?.[0] as AppSeoMetaConfig | undefined;
    }

    it.each<{ attribute: "name" | "property"; key: string }>([
      { attribute: "property", key: "og:image:alt" },
      { attribute: "name", key: "twitter:image:alt" },
    ])("should set the $key social image alt meta tag with the localized alt when mounted.", ({ attribute, key }) => {
      const metaEntry = getAppSeoMetaConfig()?.meta.find(entry => entry[attribute] === key);

      expect(metaEntry?.content()).toBe("seo.imageAlt");
    });
  });

  describe("useSchemaOrg", () => {
    type AppSchemaOrgImageObject = {
      "@type": string;
      "height": number;
      "url": string;
      "width": number;
    };

    type AppSchemaOrgNode = {
      description?: () => string;
      inLanguage?: () => string;
      name?: string;
      primaryImageOfPage?: AppSchemaOrgImageObject;
      slogan?: () => string;
    };

    function getAppSchemaOrgNodes(): AppSchemaOrgNode[] {
      return (vi.mocked(useSchemaOrg).mock.calls[0]?.[0] ?? []) as AppSchemaOrgNode[];
    }

    it("should define the Organization identity with the site name when mounted.", () => {
      expect(getAppSchemaOrgNodes()[0]?.name).toBe("Goat It");
    });

    it("should define the Organization identity with the localized description when mounted.", () => {
      expect(getAppSchemaOrgNodes()[0]?.description?.()).toBe("seo.home.description");
    });

    it("should define the Organization identity with the localized slogan when mounted.", () => {
      expect(getAppSchemaOrgNodes()[0]?.slogan?.()).toBe("home.tagline");
    });

    it("should define the WebSite with the site name when mounted.", () => {
      expect(getAppSchemaOrgNodes()[1]?.name).toBe("Goat It");
    });

    it("should define the WebSite with the localized description when mounted.", () => {
      expect(getAppSchemaOrgNodes()[1]?.description?.()).toBe("seo.home.description");
    });

    it("should define the WebPage with the current locale when mounted.", () => {
      expect(getAppSchemaOrgNodes()[2]?.inLanguage?.()).toBe("en");
    });

    it("should define the WebPage with the social image when mounted.", () => {
      expect(getAppSchemaOrgNodes()[2]?.primaryImageOfPage).toStrictEqual({
        "@type": "ImageObject",
        "height": 600,
        "url": "/og-image.png",
        "width": 1200,
      });
    });
  });

  it("should refetch the question themes when the locale changes.", async() => {
    const questionThemesStore = mockStore(useQuestionThemesStore);
    const { locale } = useI18n();
    locale.value = "fr";
    await nextTick();

    expect(questionThemesStore.fetchAndStoreQuestionThemes).toHaveBeenCalledExactlyOnceWith();
  });

  it("should show the API error toast when the question themes fetch fails.", async() => {
    const fakeError = new Error("fetch failed");
    mockStore(useQuestionThemesStore).fetchAndStoreQuestionThemes.mockResolvedValue({ ok: false, error: fakeError });
    const { locale } = useI18n();
    locale.value = "fr";
    await nextTick();

    expect(useGoatItApiErrorToastMock.instance.handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fakeError, { title: "questionThemes.cantFetch", context: "question-themes" });
  });

  it("should call once the question themes fetch when mounted.", () => {
    expect(vi.mocked(callOnce)).toHaveBeenCalledExactlyOnceWith(expect.any(Function), expect.any(String));
  });

  it("should render the ChangelogModal component when mounted.", () => {
    expect(wrapper.findComponent({ name: "ChangelogModal" }).exists()).toBe(true);
  });

  it("should skip the question themes bootstrap when the route rules disable scripts.", async() => {
    getRouteRulesMock.instance.mockReturnValue({ noScripts: true });
    vi.mocked(callOnce).mockClear();
    wrapper = await mountAppComponent({ global: { plugins: [createTestingPinia()] } });

    expect(vi.mocked(callOnce)).not.toHaveBeenCalled();
  });

  it("should render the OfflineStatusIndicator component when mounted.", () => {
    expect(wrapper.findComponent({ name: "OfflineStatusIndicator" }).exists()).toBe(true);
  });
});