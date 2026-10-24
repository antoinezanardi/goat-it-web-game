import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ChangelogWhatsNewButtonContent } from "#components";

import type { ChangelogWhatsNewButtonContentProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/ChangelogWhatsNewButtonContent/changelog-whats-new-button-content.types";

describe("ChangelogWhatsNewButtonContent Component", () => {
  const defaultChangelogWhatsNewButtonContentProps: ChangelogWhatsNewButtonContentProps = { isChangelogUnread: false } as const;

  let wrapper: VueWrapper;

  async function mountChangelogWhatsNewButtonContent(options: MountSuspendedOptions<typeof ChangelogWhatsNewButtonContent> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogWhatsNewButtonContent, { props: defaultChangelogWhatsNewButtonContentProps, ...options });
  }

  beforeEach(async() => {
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

  it("should render the client-only wrapper around the unread indicator when mounted.", () => {
    expect(wrapper.findComponent({ name: "ClientOnly" }).exists()).toBe(true);
  });

  it("should not render the unread indicator when the isChangelogUnread prop is false.", () => {
    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(false);
  });

  it("should render the unread indicator when the isChangelogUnread prop is true.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });

    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(true);
  });

  it("should hide the unread indicator again when the isChangelogUnread prop becomes false.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });
    await wrapper.setProps({ isChangelogUnread: false });

    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(false);
  });
});