import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionsFiltersModalHeader } from "#components";
import type { DefaultModalTitle, UButton } from "#components";

import type { GameQuestionsFiltersModalHeaderProps } from "@/components/domain/game/GameQuestionsFiltersModalHeader/game-questions-filters-modal-header.types";

describe("GameQuestionsFiltersModalHeader Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersModalHeaderProps: GameQuestionsFiltersModalHeaderProps = {
    appliedCount: 0,
    isResetVisible: false,
  } as const;

  async function mountGameQuestionsFiltersModalHeader(options: MountSuspendedOptions<typeof GameQuestionsFiltersModalHeader> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersModalHeader, { props: defaultGameQuestionsFiltersModalHeaderProps, shallow: false, ...options });
  }

  function getTitle(): VueWrapper<InstanceType<typeof DefaultModalTitle>> {
    return wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='game-questions-filters-modal-title']");
  }

  function getResetButton(): VueWrapper<InstanceType<typeof UButton>> {
    return wrapper.findComponent<typeof UButton>("[data-testid='game-questions-filters-modal-reset-button']");
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionsFiltersModalHeader();
  });

  it("should render GameQuestionsFiltersModalHeader when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the modal title with the title translation key when mounted.", () => {
    expect(getTitle().props("title")).toBe("game.questionsFilters.title");
  });

  it("should render the funnel icon on the modal title when mounted.", () => {
    expect(getTitle().props("icon")).toBe("i-lucide-funnel");
  });

  it("should render the applied count badge with the applied count when mounted.", async() => {
    await wrapper.setProps({ appliedCount: 2 });

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersCountBadge" }).props("count")).toBe(2);
  });

  it("should render the applied count badge even when the applied count is zero.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionsFiltersCountBadge" }).exists()).toBe(true);
  });

  it("should render the applied count badge with the modal count badge testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-modal-count-badge']").exists()).toBe(true);
  });

  it("should not render the reset button when isResetVisible is false.", () => {
    expect(getResetButton().exists()).toBe(false);
  });

  it("should render the reset button when isResetVisible is true.", async() => {
    await wrapper.setProps({ isResetVisible: true });

    expect(getResetButton().exists()).toBe(true);
  });

  it("should set the reset button label to the reset translation key when visible.", async() => {
    await wrapper.setProps({ isResetVisible: true });

    expect(getResetButton().props("label")).toBe("game.questionsFilters.reset");
  });

  it("should set the reset button icon when visible.", async() => {
    await wrapper.setProps({ isResetVisible: true });

    expect(getResetButton().props("icon")).toBe("i-lucide-rotate-ccw");
  });

  it("should emit reset when the reset button is clicked.", async() => {
    await wrapper.setProps({ isResetVisible: true });
    await getResetButton().trigger("click");

    expect(wrapper.emitted("reset")).toStrictEqual([[]]);
  });
});