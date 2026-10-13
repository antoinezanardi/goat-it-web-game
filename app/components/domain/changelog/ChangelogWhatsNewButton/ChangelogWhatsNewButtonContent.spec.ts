import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { Ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ChangelogWhatsNewButtonContent } from "#components";

import type { ChangelogWhatsNewButtonContentProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button-content.types";
import { StateNames } from "#shared/enums/state.enums";

describe("ChangelogWhatsNewButtonContent Component", () => {
  const defaultChangelogWhatsNewButtonContentProps: ChangelogWhatsNewButtonContentProps = {} as const;
  let wrapper: VueWrapper;

  async function mountChangelogWhatsNewButtonContent(options: MountSuspendedOptions<typeof ChangelogWhatsNewButtonContent> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogWhatsNewButtonContent, { props: defaultChangelogWhatsNewButtonContentProps, ...options });
  }

  function getUnreadState(): Ref<boolean> {
    return useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false);
  }

  beforeEach(async() => {
    getUnreadState().value = false;
    wrapper = await mountChangelogWhatsNewButtonContent();
  });

  it("should render ChangelogWhatsNewButtonContent when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the sparkles icon when mounted.", () => {
    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-sparkles");
  });

  it("should render the entry point label translation key when mounted.", () => {
    expect(wrapper.text()).toContain("changelog.entryPoint");
  });

  it("should apply the icon class to the icon when the icon class prop is provided.", async() => {
    wrapper = await mountChangelogWhatsNewButtonContent({ props: { iconClass: "text-primary" } });

    expect(wrapper.findComponent({ name: "UIcon" }).classes()).toContain("text-primary");
  });

  it("should not render the unread indicator when the changelog is read.", () => {
    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(false);
  });

  it("should render the unread indicator when the changelog is unread.", async() => {
    getUnreadState().value = true;
    wrapper = await mountChangelogWhatsNewButtonContent();

    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(true);
  });
});