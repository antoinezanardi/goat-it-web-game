import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import type { UseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";

import type { useAppToast as UseAppToastType } from "@/composables/ui/useAppToast/useAppToast";

let i18nMock: UseI18nMock;

// Acceptable as import() form is required to mock a module from a factory with importOriginal
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock(import("#app/nuxt"), async importOriginal => {
  const actual = await importOriginal();

  return { ...actual, useNuxtApp: ((): { $i18n: UseI18nMock } => ({ $i18n: i18nMock })) as unknown as typeof actual.useNuxtApp };
});

let useAppToast: typeof UseAppToastType;

describe("useAppToast", () => {
  beforeEach(async() => {
    i18nMock = createUseI18nMock();
    ({ useAppToast } = await import("@/composables/ui/useAppToast/useAppToast"));
  });

  describe("addSuccessToast", () => {
    it("should add toast with success defaults when called with no extra options.", () => {
      const { addSuccessToast } = useAppToast();

      addSuccessToast({});

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-circle-check-big",
        color: "success",
        title: "common.success",
      });
    });

    it("should add toast with merged options when called with extra options.", () => {
      const { addSuccessToast } = useAppToast();

      addSuccessToast({ description: "Item saved", duration: 3000 });

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-circle-check-big",
        color: "success",
        title: "common.success",
        description: "Item saved",
        duration: 3000,
      });
    });

    it("should override default title when a title is provided in options.", () => {
      const { addSuccessToast } = useAppToast();

      addSuccessToast({ title: "Custom success title" });

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-circle-check-big",
        color: "success",
        title: "Custom success title",
      });
    });
  });

  describe("addErrorToast", () => {
    it("should add toast with error defaults when called with no extra options.", () => {
      const { addErrorToast } = useAppToast();

      addErrorToast({});

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-ban",
        color: "error",
        title: "common.error",
      });
    });

    it("should add toast with merged options when called with extra options.", () => {
      const { addErrorToast } = useAppToast();

      addErrorToast({ description: "Something went wrong", duration: 5000 });

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-ban",
        color: "error",
        title: "common.error",
        description: "Something went wrong",
        duration: 5000,
      });
    });

    it("should override default title when a title is provided in options.", () => {
      const { addErrorToast } = useAppToast();

      addErrorToast({ title: "Custom error title" });

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-ban",
        color: "error",
        title: "Custom error title",
      });
    });
  });

  describe("addInfoToast", () => {
    it("should add toast with info defaults when called with no extra options.", () => {
      const { addInfoToast } = useAppToast();

      addInfoToast({});

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-info",
        color: "info",
        title: "common.info",
      });
    });

    it("should add toast with merged options when called with extra options.", () => {
      const { addInfoToast } = useAppToast();

      addInfoToast({ description: "Did you know", duration: 4000 });

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-info",
        color: "info",
        title: "common.info",
        description: "Did you know",
        duration: 4000,
      });
    });

    it("should override default title when a title is provided in options.", () => {
      const { addInfoToast } = useAppToast();

      addInfoToast({ title: "Custom info title" });

      expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
        icon: "i-lucide-info",
        color: "info",
        title: "Custom info title",
      });
    });
  });

  describe("removeToast", () => {
    it("should remove the toast matching the provided id when called.", () => {
      const { removeToast } = useAppToast();

      removeToast("some-toast-id");

      expect(useToast().remove).toHaveBeenCalledExactlyOnceWith("some-toast-id");
    });
  });
});