import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { Ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ChangelogWhatsNewButton } from "#components";
import type { ChangelogWhatsNewButtonContent } from "#components";

import type { ChangelogWhatsNewButtonProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";
import { StateNames } from "#shared/enums/state.enums";

describe("ChangelogWhatsNewButton Component", () => {
  const defaultChangelogWhatsNewButtonProps: ChangelogWhatsNewButtonProps = { variant: "button" } as const;
  let wrapper: VueWrapper;

  async function mountChangelogWhatsNewButton(options: MountSuspendedOptions<typeof ChangelogWhatsNewButton> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogWhatsNewButton, { props: defaultChangelogWhatsNewButtonProps, ...options });
  }

  function getUnreadState(): Ref<boolean> {
    return useState<boolean>(StateNames.CHANGELOG_IS_UNREAD);
  }

  function getOpenState(): Ref<boolean> {
    return useState<boolean>(StateNames.CHANGELOG_IS_OPEN);
  }

  beforeEach(async() => {
    clearNuxtState([StateNames.CHANGELOG_IS_OPEN, StateNames.CHANGELOG_IS_UNREAD]);
    wrapper = await mountChangelogWhatsNewButton();
  });

  it("should render ChangelogWhatsNewButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the changelog entry point content in the button variant when mounted.", () => {
    expect(wrapper.findComponent<typeof ChangelogWhatsNewButtonContent>({ name: "ChangelogWhatsNewButtonContent" }).exists()).toBe(true);
  });

  it("should render the entry point label translation key in the button variant when mounted.", () => {
    expect(wrapper.text()).toContain("changelog.entryPoint");
  });

  it("should not render the menu link as the root when the variant is button.", () => {
    expect(wrapper.element).toBe(wrapper.findComponent({ name: "UButton" }).element);
  });

  it("should not render the unread indicator when the changelog is read.", () => {
    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(false);
  });

  it("should render the unread indicator when the changelog is unread.", async() => {
    getUnreadState().value = true;
    wrapper = await mountChangelogWhatsNewButton();

    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(true);
  });

  it("should render the unread indicator in the menu variant when the changelog is unread.", async() => {
    getUnreadState().value = true;
    wrapper = await mountChangelogWhatsNewButton({ props: { variant: "menu" } });

    expect(wrapper.find("[data-testid='changelog-unread-indicator']").exists()).toBe(true);
  });

  it("should open the changelog when the button variant is clicked.", async() => {
    await wrapper.findComponent({ name: "UButton" }).trigger("click");

    expect(getOpenState().value).toBe(true);
  });

  it("should render a link when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { variant: "menu" } });

    expect(wrapper.findComponent({ name: "ULink" }).exists()).toBe(true);
  });

  it("should not render a button when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { variant: "menu" } });

    expect(wrapper.findComponent({ name: "UButton" }).exists()).toBe(false);
  });

  it("should render the entry point label translation key in the menu variant when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { variant: "menu" } });

    expect(wrapper.findComponent({ name: "ULink" }).text()).toContain("changelog.entryPoint");
  });

  it("should render the sparkles icon in the menu variant when the variant is menu.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { variant: "menu" } });

    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-sparkles");
  });

  it("should open the changelog when the menu variant is clicked.", async() => {
    wrapper = await mountChangelogWhatsNewButton({ props: { variant: "menu" } });
    await wrapper.findComponent({ name: "ULink" }).trigger("click");

    expect(getOpenState().value).toBe(true);
  });
});