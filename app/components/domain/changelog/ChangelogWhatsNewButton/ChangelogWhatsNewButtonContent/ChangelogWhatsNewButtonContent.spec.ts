import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ChangelogWhatsNewButtonContent } from "#components";

import type { ChangelogWhatsNewButtonContentProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/ChangelogWhatsNewButtonContent/changelog-whats-new-button-content.types";
import { CHANGELOG_UNREAD_STATUS_ID } from "@/utils/ui/changelog/changelog.constants";

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

  it("should render the megaphone icon when mounted.", () => {
    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-megaphone");
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

  it("should overlay the unread indicator on the changelog icon wrapper when the isChangelogUnread prop is true.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });
    const indicator = wrapper.find("[data-testid='changelog-unread-indicator']");

    expect({
      isOutOfFlow: indicator.classes().includes("absolute"),
      isAnchoredToIconWrapper: indicator.element.parentElement?.classList.contains("relative"),
    }).toStrictEqual({ isOutOfFlow: true, isAnchoredToIconWrapper: true });
  });

  it("should keep the unread indicator decorative and non-interactive when the isChangelogUnread prop is true.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });
    const indicator = wrapper.find("[data-testid='changelog-unread-indicator']");

    expect({
      isHiddenFromAssistiveTechnology: indicator.attributes("aria-hidden"),
      ignoresPointerEvents: indicator.classes().includes("pointer-events-none"),
    }).toStrictEqual({ isHiddenFromAssistiveTechnology: "true", ignoresPointerEvents: true });
  });

  it("should apply the pulsing animation to the unread indicator when the isChangelogUnread prop is true.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });

    expect(wrapper.find("[data-testid='changelog-unread-indicator']").classes()).toContain("changelog-unread-indicator-pulse");
  });

  it("should render the unread status translation key to screen readers when the isChangelogUnread prop is true.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });

    expect(wrapper.find("[data-testid='changelog-unread-status']").text()).toBe("changelog.unreadStatus");
  });

  it("should not render unread status text when the isChangelogUnread prop is false.", () => {
    expect(wrapper.find("[data-testid='changelog-unread-status']").text()).toBe("");
  });

  it("should keep the unread status out of the accessible name when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-unread-status']").attributes("aria-hidden")).toBe("true");
  });

  it("should identify the unread status as the accessible description target when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-unread-status']").attributes("id")).toBe(CHANGELOG_UNREAD_STATUS_ID);
  });
});