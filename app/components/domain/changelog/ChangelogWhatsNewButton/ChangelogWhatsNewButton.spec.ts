import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ChangelogWhatsNewButton } from "#components";
import type { ChangelogWhatsNewButtonContent } from "#components";

import type { ChangelogWhatsNewButtonProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";

describe("ChangelogWhatsNewButton Component", () => {
  const defaultChangelogWhatsNewButtonProps: ChangelogWhatsNewButtonProps = { displayVariant: "button", isChangelogUnread: false } as const;

  let wrapper: VueWrapper;

  async function mountChangelogWhatsNewButton(options: MountSuspendedOptions<typeof ChangelogWhatsNewButton> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogWhatsNewButton, { props: defaultChangelogWhatsNewButtonProps, ...options });
  }

  function getContent(): VueWrapper<InstanceType<typeof ChangelogWhatsNewButtonContent>> {
    return wrapper.findComponent<typeof ChangelogWhatsNewButtonContent>({ name: "ChangelogWhatsNewButtonContent" });
  }

  beforeEach(async() => {
    wrapper = await mountChangelogWhatsNewButton();
  });

  it("should render ChangelogWhatsNewButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the changelog entry point content in the button variant when mounted.", () => {
    expect(getContent().exists()).toBe(true);
  });

  it("should render the entry point label translation key in the button variant when mounted.", () => {
    expect(wrapper.text()).toContain("changelog.entryPoint");
  });

  it("should not render the menu link as the root when the variant is button.", () => {
    expect(wrapper.element).toBe(wrapper.findComponent({ name: "UButton" }).element);
  });

  it("should pass isChangelogUnread as false to the content when mounted.", () => {
    expect(getContent().props("isChangelogUnread")).toBe(false);
  });

  it("should pass isChangelogUnread as true to the content when the changelog is unread.", async() => {
    await wrapper.setProps({ isChangelogUnread: true });

    expect(getContent().props("isChangelogUnread")).toBe(true);
  });

  it("should pass isChangelogUnread as true to the content in the menu variant when the changelog is unread.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { displayVariant: "menu", isChangelogUnread: true } });

    expect(getContent().props("isChangelogUnread")).toBe(true);
  });

  it("should emit openChangelog when the button variant is clicked.", async() => {
    await wrapper.findComponent({ name: "UButton" }).trigger("click");

    expect(wrapper.emitted("openChangelog")).toStrictEqual([[]]);
  });

  it("should render a link when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { displayVariant: "menu", isChangelogUnread: false } });

    expect(wrapper.findComponent({ name: "ULink" }).exists()).toBe(true);
  });

  it("should not render a button when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { displayVariant: "menu", isChangelogUnread: false } });

    expect(wrapper.findComponent({ name: "UButton" }).exists()).toBe(false);
  });

  it("should render the entry point label translation key in the menu variant when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { displayVariant: "menu", isChangelogUnread: false } });

    expect(wrapper.findComponent({ name: "ULink" }).text()).toContain("changelog.entryPoint");
  });

  it("should render the sparkles icon in the menu variant when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { displayVariant: "menu", isChangelogUnread: false } });

    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-sparkles");
  });

  it("should emit openChangelog when the menu variant is clicked.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { displayVariant: "menu", isChangelogUnread: false } });
    await wrapper.findComponent({ name: "ULink" }).trigger("click");

    expect(wrapper.emitted("openChangelog")).toStrictEqual([[]]);
  });
});