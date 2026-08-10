import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ConfirmDialog } from "#components";
import type { DefaultModalFooter, DefaultModalTitle, UModal } from "#components";

import type { ConfirmDialogProps } from "~/components/shared/ui/modal/ConfirmDialog/confirm-dialog.types";

describe("ConfirmDialog Component", () => {
  let wrapper: VueWrapper;

  const defaultConfirmDialogProps: ConfirmDialogProps = {
    icon: "i-lucide-archive",
    title: "Archive this theme?",
    description: "This theme will be archived.",
  };

  async function mountConfirmDialogComponent(options: MountSuspendedOptions<typeof ConfirmDialog> = {}): Promise<VueWrapper> {
    return mountSuspended(ConfirmDialog, {
      props: defaultConfirmDialogProps,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountConfirmDialogComponent();
  });

  it("should render the confirm dialog component when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  describe("Modal", () => {
    it("should render the modal as open when mounted.", () => {
      const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

      expect(modal.props("open")).toBe(true);
    });

    it("should close the modal when the modal emits update:open with false.", async() => {
      const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });
      getWrapperVm(modal).$emit("update:open", false);
      await wrapper.vm.$nextTick();

      expect(modal.props("open")).toBe(false);
    });
  });

  describe("Title", () => {
    it("should pass the icon to the default modal title when mounted.", () => {
      const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='confirm-dialog-title']");

      expect(title.props("icon")).toBe("i-lucide-archive");
    });

    it("should pass the title to the default modal title when mounted.", () => {
      const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='confirm-dialog-title']");

      expect(title.props("title")).toBe("Archive this theme?");
    });
  });

  describe("Description", () => {
    it("should render the description text when mounted.", () => {
      const description = document.body.querySelector("[data-testid='confirm-dialog-description']");

      expect(description?.textContent).toBe("This theme will be archived.");
    });
  });

  describe("Footer", () => {
    it("should pass the default confirm label to the footer primary button when no primaryButtonLabel prop is provided.", () => {
      const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='confirm-dialog-footer']");

      expect(footer.props("primaryButtonLabel")).toBe("common.confirm");
    });

    it("should pass the custom confirm label to the footer primary button when primaryButtonLabel prop is provided.", async() => {
      wrapper = await mountConfirmDialogComponent({
        props: {
          ...defaultConfirmDialogProps,
          primaryButtonLabel: "Delete it",
        },
      });
      const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='confirm-dialog-footer']");

      expect(footer.props("primaryButtonLabel")).toBe("Delete it");
    });

    it("should pass the default cancel label to the footer close button when no closeButtonLabel prop is provided.", () => {
      const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='confirm-dialog-footer']");

      expect(footer.props("closeButtonLabel")).toBe("common.cancel");
    });

    it("should pass the custom cancel label to the footer close button when closeButtonLabel prop is provided.", async() => {
      wrapper = await mountConfirmDialogComponent({
        props: {
          ...defaultConfirmDialogProps,
          closeButtonLabel: "Never mind",
        },
      });
      const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='confirm-dialog-footer']");

      expect(footer.props("closeButtonLabel")).toBe("Never mind");
    });

    it("should emit close with false when the footer emits closeModal.", () => {
      const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='confirm-dialog-footer']");
      getWrapperVm(footer).$emit("closeModal");

      expect(wrapper.emitted("close")).toStrictEqual([[false]]);
    });

    it("should emit close with true when the footer emits primaryButtonClick.", () => {
      const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='confirm-dialog-footer']");
      getWrapperVm(footer).$emit("primaryButtonClick");

      expect(wrapper.emitted("close")).toStrictEqual([[true]]);
    });
  });

  describe("dismissible and close props", () => {
    it.each<{ propName: "dismissible" | "close" }>([
      { propName: "dismissible" },
      { propName: "close" },
    ])("should pass $propName as true to UModal when no $propName prop is provided.", ({ propName }) => {
      const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

      expect(modal.props(propName)).toBe(true);
    });

    it("should pass dismissible as false to UModal when the prop is set to false.", async() => {
      wrapper = await mountConfirmDialogComponent({
        props: {
          ...defaultConfirmDialogProps,
          dismissible: false,
        },
      });
      const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

      expect(modal.props("dismissible")).toBe(false);
    });

    it("should pass close as false to UModal when the prop is set to false.", async() => {
      wrapper = await mountConfirmDialogComponent({
        props: {
          ...defaultConfirmDialogProps,
          close: false,
        },
      });
      const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

      expect(modal.props("close")).toBe(false);
    });
  });
});