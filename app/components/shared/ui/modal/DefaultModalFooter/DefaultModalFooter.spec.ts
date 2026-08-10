import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import type { ComponentExposed } from "vue-component-type-helpers";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { DefaultModalFooter } from "#components";
import type { UButton, UIcon, UKbd } from "#components";

import type { DefaultModalFooterProps } from "~/components/shared/ui/modal/DefaultModalFooter/default-modal-footer.types";

describe("DefaultModalFooter Component", () => {
  let wrapper: VueWrapper;

  const defaultDefaultModalFooterProps: DefaultModalFooterProps = {
    primaryButtonLabel: "common.create",
    primaryButtonIcon: "i-lucide-circle-plus",
  } as const;

  async function mountDefaultModalFooterComponent(options: MountSuspendedOptions<typeof DefaultModalFooter> = {}): Promise<VueWrapper> {
    return mountSuspended(DefaultModalFooter, {
      props: defaultDefaultModalFooterProps,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountDefaultModalFooterComponent();
  });

  it("should render the default modal footer component when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  describe("Close button", () => {
    describe("Label", () => {
      it("should display the common.close i18n key as label when closeButtonLabel prop is not provided.", () => {
        const closeButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-close-button']");

        expect(closeButton.props("label")).toBe("common.close");
      });

      it("should display the custom label when closeButtonLabel prop is provided.", async() => {
        await wrapper.setProps({ closeButtonLabel: "common.cancel" });

        const closeButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-close-button']");

        expect(closeButton.props("label")).toBe("common.cancel");
      });
    });

    describe("Disabled state", () => {
      it("should not be disabled when isCloseButtonDisabled is not provided.", () => {
        const closeButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-close-button']");

        expect(closeButton.attributes("disabled")).toBeUndefined();
      });

      it("should be disabled when isCloseButtonDisabled is true.", async() => {
        await wrapper.setProps({ isCloseButtonDisabled: true });

        const closeButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-close-button']");

        expect(closeButton.attributes("disabled")).toBeDefined();
      });
    });

    describe("Click", () => {
      it("should emit closeModal when the close button is clicked.", async() => {
        const closeButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-close-button']");

        await closeButton.trigger("click");

        expect(wrapper.emitted("closeModal")).toBeDefined();
      });
    });
  });

  describe("Close button shortcut display", () => {
    let closeButton: VueWrapper;
    let escapeKbd: VueWrapper<ComponentExposed<typeof UKbd>>;

    beforeEach(() => {
      closeButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-close-button']");
      escapeKbd = closeButton.findComponent<typeof UKbd>("[data-testid='default-modal-footer-close-button-shortcut-escape']");
    });

    it("should render UKbd with escape value when mounted.", () => {
      expect(escapeKbd.props("value")).toBe("escape");
    });

    it("should render UKbd with sm size when mounted.", () => {
      expect(escapeKbd.props("size")).toBe("sm");
    });
  });

  describe("Primary button", () => {
    describe("Label", () => {
      it("should pass the primaryButtonLabel prop to the primary button when mounted.", () => {
        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");

        expect(primaryButton.props("label")).toBe("common.create");
      });
    });

    describe("Icon", () => {
      it("should pass the primaryButtonIcon prop to the primary button when mounted.", () => {
        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");
        const leadingIcon = primaryButton.findComponent<typeof UIcon>({ name: "UIcon" });

        expect(leadingIcon.props("name")).toBe("i-lucide-circle-plus");
      });
    });

    describe("Disabled state", () => {
      it("should not be disabled when isPrimaryButtonDisabled is not provided.", () => {
        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");

        expect(primaryButton.attributes("disabled")).toBeUndefined();
      });

      it("should be disabled when isPrimaryButtonDisabled is true.", async() => {
        await wrapper.setProps({ isPrimaryButtonDisabled: true });

        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");

        expect(primaryButton.attributes("disabled")).toBeDefined();
      });
    });

    describe("Loading state", () => {
      it("should not have loading icon when isPrimaryButtonLoading is false.", () => {
        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");
        const leadingIcon = primaryButton.findComponent<typeof UIcon>({ name: "UIcon" });

        expect(leadingIcon.props("name")).toBe("i-lucide-circle-plus");
      });

      it("should have loading icon when isPrimaryButtonLoading is true.", async() => {
        await wrapper.setProps({ isPrimaryButtonLoading: true });

        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");
        const leadingIcon = primaryButton.findComponent<typeof UIcon>({ name: "UIcon" });

        expect(leadingIcon.props("name")).toBe("i-lucide-loader-circle");
      });
    });

    describe("Click", () => {
      it("should emit primaryButtonClick when the primary button is clicked.", async() => {
        const primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");

        await primaryButton.trigger("click");

        expect(wrapper.emitted("primaryButtonClick")).toBeDefined();
      });
    });
  });

  describe("Shortcut display", () => {
    let primaryButton: VueWrapper;

    beforeEach(() => {
      primaryButton = wrapper.findComponent<typeof UButton>("[data-testid='default-modal-footer-primary-button']");
    });

    describe("Meta KBD", () => {
      let metaKbd: VueWrapper<ComponentExposed<typeof UKbd>>;

      beforeEach(() => {
        metaKbd = primaryButton.findComponent<typeof UKbd>("[data-testid='default-modal-footer-primary-button-shortcut-meta']");
      });

      it("should render UKbd with meta value when mounted.", () => {
        expect(metaKbd.props("value")).toBe("meta");
      });

      it("should render UKbd with sm size when mounted.", () => {
        expect(metaKbd.props("size")).toBe("sm");
      });
    });

    describe("Enter KBD", () => {
      let enterKbd: VueWrapper<ComponentExposed<typeof UKbd>>;

      beforeEach(() => {
        enterKbd = primaryButton.findComponent<typeof UKbd>("[data-testid='default-modal-footer-primary-button-shortcut-enter']");
      });

      it("should render UKbd with enter value when mounted.", () => {
        expect(enterKbd.props("value")).toBe("enter");
      });

      it("should render UKbd with sm size when mounted.", () => {
        expect(enterKbd.props("size")).toBe("sm");
      });
    });
  });

  describe("Keyboard shortcut", () => {
    function dispatchMetaEnterKeydown(): void {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true }));
    }

    it("should emit primaryButtonClick when meta+enter is pressed and primary button is enabled.", () => {
      dispatchMetaEnterKeydown();

      expect(wrapper.emitted("primaryButtonClick")).toHaveLength(1);
    });

    it("should not emit primaryButtonClick when meta+enter is pressed and primary button is disabled.", async() => {
      await wrapper.setProps({ isPrimaryButtonDisabled: true });

      dispatchMetaEnterKeydown();

      expect(wrapper.emitted("primaryButtonClick")).toBeUndefined();
    });

    it("should not emit primaryButtonClick when meta+enter is pressed and primary button is loading.", async() => {
      await wrapper.setProps({ isPrimaryButtonLoading: true });

      dispatchMetaEnterKeydown();

      expect(wrapper.emitted("primaryButtonClick")).toBeUndefined();
    });

    it("should not emit primaryButtonClick when the meta+enter shortcut is triggered and shortcuts are disabled.", async() => {
      await wrapper.setProps({ disableShortcuts: true });

      dispatchMetaEnterKeydown();

      expect(wrapper.emitted("primaryButtonClick")).toBeUndefined();
    });

    it("should emit primaryButtonClick when the meta+enter shortcut is triggered and shortcuts are not disabled.", () => {
      dispatchMetaEnterKeydown();

      expect(wrapper.emitted("primaryButtonClick")).toHaveLength(1);
    });
  });
});