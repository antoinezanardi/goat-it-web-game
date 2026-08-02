import { beforeEach, describe, expect, it } from "vitest";

import type { useAppToast as UseAppToastType } from "@/composables/ui/useAppToast/useAppToast";

let useAppToast: typeof UseAppToastType;

describe("useAppToast", () => {
  beforeEach(async() => {
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
});