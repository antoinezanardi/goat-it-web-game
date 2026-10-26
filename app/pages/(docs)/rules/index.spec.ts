import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { useAsyncDataMock } from "~~/tests/unit/setup/nuxt/composables/use-async-data.nuxt.unit-setup";

import type { UButton } from "#components";
import { StatusScreen } from "#components";

import RulesPage from "@/pages/(docs)/rules/index.vue";

describe("Rules Page", () => {
  let wrapper: VueWrapper;

  async function mountRulesPage(options: MountSuspendedOptions<typeof RulesPage> = {}): Promise<VueWrapper> {
    return mountSuspended(RulesPage, { shallow: true, ...options });
  }

  describe("when content is pending.", () => {
    beforeEach(async() => {
      useAsyncDataMock.instance.mockReturnValue({
        data: ref<unknown>(null),
        status: ref("pending"),
        execute: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
      });
      wrapper = await mountRulesPage();
    });

    it("should render Rules Page when mounted.", () => {
      expect(wrapper.exists()).toBeTruthy();
    });

    it("should render LoadingSpinner when status is pending.", () => {
      expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(true);
    });

    it("should not render StatusScreen when status is pending.", () => {
      expect(wrapper.findComponent(StatusScreen).exists()).toBe(false);
    });

    it("should not render DocsPageShell when status is pending.", () => {
      expect(wrapper.findComponent({ name: "DocsPageShell" }).exists()).toBe(false);
    });

    it("should call useAsyncData when mounted.", () => {
      expect(useAsyncDataMock.instance).toHaveBeenCalledOnce();
    });

    it("should call useAsyncData with locale-prefixed key when mounted.", () => {
      const key = useAsyncDataMock.instance.mock.calls[0]?.[0];

      expect(key).toBe("rules-en");
    });
  });

  describe("when content loads successfully.", () => {
    beforeEach(async() => {
      useAsyncDataMock.instance.mockReturnValue({
        data: ref<unknown>([{ title: "How to play", description: "Rules" }, []]),
        status: ref("success"),
        execute: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
      });
      wrapper = await mountRulesPage();
    });

    it("should render DocsPageShell when status is success.", () => {
      expect(wrapper.findComponent({ name: "DocsPageShell" }).exists()).toBe(true);
    });

    it("should pass the sections to DocsPageShell when status is success.", () => {
      const docsPageShell = wrapper.findComponent({ name: "DocsPageShell" });

      expect(docsPageShell.props("sections")).toStrictEqual([]);
    });

    it("should render ContentRenderer with the page data when status is success.", () => {
      const contentRenderer = wrapper.findComponent({ name: "ContentRenderer" });

      expect(contentRenderer.props("value")).toStrictEqual({ title: "How to play", description: "Rules" });
    });

    it("should render the start game button when status is success.", () => {
      expect(wrapper.find("[data-testid='docs-start-game-button']").exists()).toBe(true);
    });

    it("should pass the game route to the start game button when status is success.", () => {
      const startGameButton = wrapper.findComponent({ name: "UButton" });

      expect(startGameButton.props("to")).toBe("/game");
    });

    it("should render the play icon on the start game button when status is success.", () => {
      const startGameButton = wrapper.findComponent({ name: "UButton" });

      expect(startGameButton.props("icon")).toBe("i-lucide-play");
    });

    it("should pass the start game i18n key as the label of the start game button when status is success.", () => {
      const startGameButton = wrapper.findComponent({ name: "UButton" });

      expect(startGameButton.props("label")).toBe("docs.startGame");
    });

    it("should not render LoadingSpinner when status is success.", () => {
      expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(false);
    });
  });

  describe("when content is not found.", () => {
    beforeEach(async() => {
      useAsyncDataMock.instance.mockReturnValue({
        data: ref<unknown>(null),
        status: ref("success"),
        execute: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
      });
      wrapper = await mountRulesPage();
    });

    it("should render StatusScreen when data is null and status is success.", () => {
      expect(wrapper.findComponent(StatusScreen).exists()).toBe(true);
    });

    it("should pass the pageNotFound message key to StatusScreen when data is null and status is success.", () => {
      expect(wrapper.findComponent(StatusScreen).props("title")).toBe("errors.pageNotFound");
    });

    it("should pass the file-question icon to StatusScreen when data is null and status is success.", () => {
      expect(wrapper.findComponent(StatusScreen).props("icon")).toBe("i-lucide-file-question");
    });

    it("should render the rules-page-not-found test id when data is null and status is success.", async() => {
      wrapper = await mountRulesPage({ shallow: false });

      expect(wrapper.find("[data-testid='rules-page-not-found']").exists()).toBe(true);
    });

    it("should not render DocsPageShell when data is null.", () => {
      expect(wrapper.findComponent({ name: "DocsPageShell" }).exists()).toBe(false);
    });

    it("should pass the root route to the back home button when data is null and status is success.", async() => {
      wrapper = await mountRulesPage({ shallow: false });
      const backHomeButton = wrapper.findComponent<typeof UButton>({ name: "UButton" });

      expect(backHomeButton.props("to")).toBe("/");
    });

    it("should pass the backToHome i18n key to the back home button when data is null and status is success.", async() => {
      wrapper = await mountRulesPage({ shallow: false });
      const backHomeButton = wrapper.findComponent<typeof UButton>({ name: "UButton" });

      expect(backHomeButton.props("label")).toBe("common.backToHome");
    });

    it("should render the back home button test id when data is null and status is success.", async() => {
      wrapper = await mountRulesPage({ shallow: false });

      expect(wrapper.find("[data-testid='rules-page-back-home']").exists()).toBe(true);
    });

    it("should render the house icon on the back home button when data is null and status is success.", async() => {
      wrapper = await mountRulesPage({ shallow: false });
      const backHomeButton = wrapper.findComponent<typeof UButton>({ name: "UButton" });

      expect(backHomeButton.props("icon")).toBe("i-lucide-house");
    });
  });

  describe("when content fetch errors.", () => {
    let executeMock: Mock<() => Promise<unknown>>;

    beforeEach(async() => {
      executeMock = vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined);
      useAsyncDataMock.instance.mockReturnValue({
        data: ref<unknown>(null),
        status: ref("error"),
        execute: executeMock,
      });
      wrapper = await mountRulesPage();
    });

    it("should render StatusScreen when status is error.", () => {
      expect(wrapper.findComponent(StatusScreen).exists()).toBe(true);
    });

    it("should pass the generic error message key to StatusScreen when status is error.", () => {
      expect(wrapper.findComponent(StatusScreen).props("title")).toBe("errors.generic");
    });

    it("should pass the triangle-alert icon to StatusScreen when status is error.", () => {
      expect(wrapper.findComponent(StatusScreen).props("icon")).toBe("i-lucide-triangle-alert");
    });

    it("should render the rules-page-error test id when status is error.", async() => {
      wrapper = await mountRulesPage({ shallow: false });

      expect(wrapper.find("[data-testid='rules-page-error']").exists()).toBe(true);
    });

    it("should not render DocsPageShell when status is error.", () => {
      expect(wrapper.findComponent({ name: "DocsPageShell" }).exists()).toBe(false);
    });

    it("should pass the common.retry i18n key to the retry button when status is error.", async() => {
      wrapper = await mountRulesPage({ shallow: false });
      const retryButton = wrapper.findComponent<typeof UButton>("[data-testid='rules-page-retry']");

      expect(retryButton.props("label")).toBe("common.retry");
    });

    it("should render the retry button test id when status is error.", async() => {
      wrapper = await mountRulesPage({ shallow: false });

      expect(wrapper.find("[data-testid='rules-page-retry']").exists()).toBe(true);
    });

    it("should render the refresh icon on the retry button when status is error.", async() => {
      wrapper = await mountRulesPage({ shallow: false });
      const retryButton = wrapper.findComponent<typeof UButton>("[data-testid='rules-page-retry']");

      expect(retryButton.props("icon")).toBe("i-lucide-refresh-cw");
    });

    it("should execute the content fetch when the retry button is clicked.", async() => {
      wrapper = await mountRulesPage({ shallow: false });
      await wrapper.find("[data-testid='rules-page-retry']").trigger("click");

      expect(executeMock).toHaveBeenCalledOnce();
    });
  });

  describe("SEO meta", () => {
    beforeEach(async() => {
      useAsyncDataMock.instance.mockReturnValue({
        data: ref<unknown>(null),
        status: ref("pending"),
        execute: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
      });
      wrapper = await mountRulesPage();
    });

    it("should configure SEO meta tags when mounted.", () => {
      const useHeadMock = vi.mocked(useHead);
      const headInput = useHeadMock.mock.calls[0]?.[0] as
        | { title: () => string; meta: { name?: string; property?: string; content: () => string }[] } |
        undefined;

      expect({
        title: headInput?.title(),
        meta: headInput?.meta.map(entry => (Object.assign(entry, { content: entry.content() }))),
      }).toStrictEqual({
        title: "seo.rules.title",
        meta: [
          { name: "description", content: "seo.rules.description" },
          { property: "og:title", content: "seo.rules.title" },
          { property: "og:description", content: "seo.rules.description" },
        ],
      });
    });
  });

  describe("useAsyncData options", () => {
    beforeEach(async() => {
      useAsyncDataMock.instance.mockReturnValue({
        data: ref<unknown>(null),
        status: ref("pending"),
        execute: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
      });
      wrapper = await mountRulesPage();
    });

    it("should pass watch: [locale] option to useAsyncData when mounted.", () => {
      const options = useAsyncDataMock.instance.mock.calls[0]?.[2];
      const { locale } = useI18n();

      expect(options?.watch).toStrictEqual([locale]);
    });
  });
});