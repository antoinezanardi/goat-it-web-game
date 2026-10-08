import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionsFiltersCountBadge } from "#components";

import type { GameQuestionsFiltersCountBadgeProps } from "@/components/domain/game/GameQuestionsFiltersCountBadge/game-questions-filters-count-badge.types";

describe("GameQuestionsFiltersCountBadge Component", () => {
  const defaultGameQuestionsFiltersCountBadgeProps: GameQuestionsFiltersCountBadgeProps = {
    count: 0,
  } as const;

  let wrapper: VueWrapper;

  async function mountGameQuestionsFiltersCountBadge(options: MountSuspendedOptions<typeof GameQuestionsFiltersCountBadge> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersCountBadge, { props: defaultGameQuestionsFiltersCountBadgeProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionsFiltersCountBadge();
  });

  it("should render GameQuestionsFiltersCountBadge when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render a UBadge when mounted.", () => {
    expect(wrapper.findComponent({ name: "UBadge" }).exists()).toBe(true);
  });

  it("should render the count as the badge content when mounted.", async() => {
    await wrapper.setProps({ count: 2 });

    expect(wrapper.text()).toBe("2");
  });

  it("should set the UBadge aria-label to the applied count translation key when mounted.", async() => {
    await wrapper.setProps({ count: 2 });
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.attributes("aria-label")).toBe("game.questionsFilters.appliedCount");
  });

  it("should forward the data-testid attribute to the badge when provided.", async() => {
    const attributesWrapper = await mountGameQuestionsFiltersCountBadge({ attrs: { "data-testid": "game-questions-filters-count-badge" } });

    expect(attributesWrapper.find("[data-testid='game-questions-filters-count-badge']").exists()).toBe(true);
  });

  it("should forward the class attribute to the badge when provided.", async() => {
    const attributesWrapper = await mountGameQuestionsFiltersCountBadge({ attrs: { class: "ml-1" } });

    expect(attributesWrapper.findComponent({ name: "UBadge" }).classes()).toContain("ml-1");
  });
});