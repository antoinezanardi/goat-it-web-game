import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { useQuestionCardHighlightMock } from "~~/tests/unit/setup/nuxt/composables/use-question-card-highlight.nuxt.unit-setup";

import { GameQuestionCardAdultContentBadge } from "#components";

describe("GameQuestionCardAdultContentBadge Component", () => {
  let wrapper: VueWrapper;

  async function mountBadge(options: MountSuspendedOptions<typeof GameQuestionCardAdultContentBadge> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardAdultContentBadge, { shallow: false, attachTo: document.body, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountBadge();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render GameQuestionCardAdultContentBadge when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the UBadge component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UBadge" }).exists()).toBe(true);
  });

  it("should set the UBadge icon to the question adult content icon when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("icon")).toBe("i-lucide-venetian-mask");
  });

  it("should apply the data-testid attribute to the badge when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-adult-content']").exists()).toBe(true);
  });

  it("should set the UBadge aria-label to the adult content tooltip i18n key when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-adult-content']").attributes("aria-label")).toBe("questions.adultContentTooltip");
  });

  it("should wrap the badge in a UPopover when mounted.", () => {
    expect(wrapper.findComponent({ name: "UPopover" }).exists()).toBe(true);
  });

  it("should render the adult content tooltip popover content when the badge is hovered.", async() => {
    vi.useFakeTimers();

    await wrapper.find("[data-testid='game-question-adult-content']").trigger("pointerenter");
    vi.advanceTimersByTime(1000);
    await flushPromises();

    const content = document.body.querySelector("[data-testid='game-question-adult-content-popover']");

    expect(content?.textContent).toBe("questions.adultContentTooltip");
  });

  type GameQuestionCardAdultContentBadgeVm = ComponentVm & { playHighlight: () => Promise<void> };

  it("should call useQuestionCardHighlight().animate with its badge element when playHighlight is called.", async() => {
    const vm = getWrapperVm<GameQuestionCardAdultContentBadgeVm>(wrapper);
    const badgeElement = wrapper.findComponent({ name: "UBadge" }).element as HTMLElement;

    await vm.playHighlight();

    expect(useQuestionCardHighlightMock.instance.animate).toHaveBeenCalledExactlyOnceWith([badgeElement]);
  });

  it("should not call useQuestionCardHighlight().animate when playHighlight is called and the badge element reference is null.", async() => {
    const vm = getWrapperVm<GameQuestionCardAdultContentBadgeVm>(wrapper);
    vm.$.refs.badgeElementReference = null;

    await vm.playHighlight();

    expect(useQuestionCardHighlightMock.instance.animate).not.toHaveBeenCalled();
  });
});