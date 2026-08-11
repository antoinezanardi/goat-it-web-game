import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import RulesPage from "@/pages/(docs)/rules.vue";

type AsyncDataStatus = "idle" | "pending" | "success" | "error";

type AsyncDataMockReturnValue = {
  data: Ref<unknown>;
  status: Ref<AsyncDataStatus>;
};

type AsyncDataMockSignature = (
  key: string,
  handler: () => Promise<unknown>,
  options?: { watch: unknown[] },
) => AsyncDataMockReturnValue;

const { useAsyncDataMock } = vi.hoisted(() => ({
  useAsyncDataMock: vi.fn<AsyncDataMockSignature>(),
}));

const { definePageMetaMock } = vi.hoisted(() => ({
  definePageMetaMock: vi.fn<() => void>(),
}));

mockNuxtImport("useAsyncData", () => useAsyncDataMock);
mockNuxtImport("definePageMeta", () => definePageMetaMock);

describe("Rules Page", () => {
  let wrapper: VueWrapper;

  async function mountRulesPage(options: MountSuspendedOptions<typeof RulesPage> = {}): Promise<VueWrapper> {
    return mountSuspended(RulesPage, { shallow: true, ...options });
  }

  describe("when content is pending.", () => {
    beforeEach(async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref<null>(null),
        status: ref("pending"),
      });
      wrapper = await mountRulesPage();
    });

    it("should render LoadingSpinner when status is pending.", () => {
      expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(true);
    });

    it("should not render error message when status is pending.", () => {
      expect(wrapper.text()).not.toContain("errors.generic");
    });

    it("should not render ContentRenderer when status is pending.", () => {
      expect(wrapper.findComponent({ name: "ContentRenderer" }).exists()).toBe(false);
    });

    it("should call useAsyncData when mounted.", () => {
      expect(useAsyncDataMock).toHaveBeenCalledOnce();
    });

    it("should call useAsyncData with locale-prefixed key when mounted.", () => {
      const key = useAsyncDataMock.mock.calls[0]?.[0];

      expect(key).toBe("rules-en");
    });
  });

  describe("when content loads successfully.", () => {
    beforeEach(async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref({ title: "How to play", description: "Rules" }),
        status: ref("success"),
      });
      wrapper = await mountRulesPage();
    });

    it("should render ContentRenderer with the page data when status is success.", () => {
      expect(wrapper.findComponent({ name: "ContentRenderer" }).exists()).toBe(true);
    });

    it("should not render LoadingSpinner when status is success.", () => {
      expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(false);
    });
  });

  describe("when content is not found.", () => {
    beforeEach(async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref<null>(null),
        status: ref("success"),
      });
      wrapper = await mountRulesPage();
    });

    it("should render pageNotFound message when data is null and status is success.", () => {
      expect(wrapper.text()).toContain("errors.pageNotFound");
    });

    it("should not render ContentRenderer when data is null.", () => {
      expect(wrapper.findComponent({ name: "ContentRenderer" }).exists()).toBe(false);
    });
  });

  describe("when content fetch errors.", () => {
    beforeEach(async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref<null>(null),
        status: ref("error"),
      });
      wrapper = await mountRulesPage();
    });

    it("should render generic error message when status is error.", () => {
      expect(wrapper.text()).toContain("errors.generic");
    });

    it("should not render ContentRenderer when status is error.", () => {
      expect(wrapper.findComponent({ name: "ContentRenderer" }).exists()).toBe(false);
    });
  });

  describe("definePageMeta", () => {
    it("should call definePageMeta with docs layout when mounted.", async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref<null>(null),
        status: ref("pending"),
      });
      wrapper = await mountRulesPage();

      expect(definePageMetaMock).toHaveBeenCalledExactlyOnceWith({ layout: "docs" });
    });
  });

  describe("SEO meta", () => {
    it("should configure SEO meta tags when mounted.", async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref<null>(null),
        status: ref("pending"),
      });
      wrapper = await mountRulesPage();

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
    it("should pass watch: [locale] option to useAsyncData when mounted.", async() => {
      useAsyncDataMock.mockReturnValue({
        data: ref<null>(null),
        status: ref("pending"),
      });
      wrapper = await mountRulesPage();

      const options = useAsyncDataMock.mock.calls[0]?.[2];

      expect(options?.watch).toBeDefined();
    });
  });
});