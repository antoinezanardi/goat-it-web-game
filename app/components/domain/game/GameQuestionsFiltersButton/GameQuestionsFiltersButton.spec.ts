import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createMainLandmark, removeMainLandmark } from "~~/tests/unit/utils/helpers/main-landmark.helpers";

import { GameQuestionsFiltersButton } from "#components";

import { GAME_QUESTIONS_FILTERS_BUTTON_UI } from "@/components/domain/game/GameQuestionsFiltersButton/game-questions-filters-button.constants";

describe("GameQuestionsFiltersButton Component", () => {
  let wrapper: VueWrapper;

  async function mountGameQuestionsFiltersButton(options: MountSuspendedOptions<typeof GameQuestionsFiltersButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersButton, { shallow: false, ...options });
  }

  beforeEach(async() => {
    createMainLandmark();
    wrapper = await mountGameQuestionsFiltersButton();
  });

  afterEach(() => {
    removeMainLandmark();
  });

  it("should render GameQuestionsFiltersButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render a UButton when mounted.", () => {
    expect(wrapper.findComponent({ name: "UButton" }).exists()).toBeTruthy();
  });

  it("should set the UButton icon to the funnel icon when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("icon")).toBe("i-lucide-funnel");
  });

  it("should pass the GAME_QUESTIONS_FILTERS_BUTTON_UI ui config to UButton when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(GAME_QUESTIONS_FILTERS_BUTTON_UI);
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-button']").exists()).toBe(true);
  });

  it("should set the aria-label attribute to the trigger label translation key when mounted.", () => {
    expect(wrapper.find("button").attributes("aria-label")).toBe("game.questionsFilters.triggerLabel");
  });

  it("should render the tooltip with the trigger tooltip translation key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.props("text")).toBe("game.questionsFilters.triggerTooltip");
  });

  it("should emit click when the button is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toStrictEqual([[]]);
  });
});