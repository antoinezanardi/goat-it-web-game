import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { DefaultModalTitle } from "#components";
import type { UIcon } from "#components";

import type { DefaultModalTitleProps } from "~/components/shared/ui/modal/DefaultModalTitle/default-modal-title.types";

describe("DefaultModalTitle Component", () => {
  let wrapper: VueWrapper;

  const defaultDefaultModalTitleProps: DefaultModalTitleProps = {
    icon: "i-lucide-palette",
    title: "My modal title",
  } as const;

  async function mountDefaultModalTitleComponent(options: MountSuspendedOptions<typeof DefaultModalTitle> = {}): Promise<VueWrapper> {
    return mountSuspended(DefaultModalTitle, {
      props: defaultDefaultModalTitleProps,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountDefaultModalTitleComponent();
  });

  it("should render the default modal title component when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  describe("Icon", () => {
    it("should pass the icon name to the UIcon component when mounted.", () => {
      const icon = wrapper.getComponent<typeof UIcon>({ name: "UIcon" });

      expect(icon.props("name")).toBe("i-lucide-palette");
    });

    it("should pass a different icon name to the UIcon component when icon prop changes.", async() => {
      await wrapper.setProps({ icon: "i-lucide-star", title: "Title" });

      const icon = wrapper.getComponent<typeof UIcon>({ name: "UIcon" });

      expect(icon.props("name")).toBe("i-lucide-star");
    });
  });

  describe("Title", () => {
    it("should display the title text when mounted.", () => {
      const container = wrapper.find("[data-testid='default-modal-title-text']");

      expect(container.text()).toBe("My modal title");
    });

    it("should display a different title when title prop changes.", async() => {
      await wrapper.setProps({ icon: "i-lucide-palette", title: "Another title" });
      const container = wrapper.find("[data-testid='default-modal-title-text']");

      expect(container.text()).toContain("Another title");
    });
  });
});