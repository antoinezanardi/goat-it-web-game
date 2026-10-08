import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { createMainLandmark, removeMainLandmark } from "~~/tests/unit/utils/helpers/main-landmark.helpers";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { useQuestionCardHighlightMock } from "~~/tests/unit/setup/nuxt/composables/use-question-card-highlight.nuxt.unit-setup";

import { GameQuestionsFiltersButton } from "#components";

import { GAME_QUESTIONS_FILTERS_BUTTON_UI } from "@/components/domain/game/GameQuestionsFiltersButton/game-questions-filters-button.constants";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

describe("GameQuestionsFiltersButton Component", () => {
  let wrapper: VueWrapper;

  async function mountGameQuestionsFiltersButton(options: MountSuspendedOptions<typeof GameQuestionsFiltersButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersButton, { global: { plugins: [createTestingPinia()] }, shallow: false, ...options });
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

  it("should not render the count badge when no filter group is active.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionsFiltersCountBadge" }).exists()).toBe(false);
  });

  it("should render the count badge with one when only one filter group is active.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await nextTick();

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersCountBadge" }).props("count")).toBe(1);
  });

  it("should render the count badge with two when both filter groups are active.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["hard"] });
    await nextTick();

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersCountBadge" }).props("count")).toBe(2);
  });

  it("should forward the data-testid attribute to the count badge when a filter group is active.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await nextTick();

    expect(wrapper.find("[data-testid='game-questions-filters-button-badge']").exists()).toBe(true);
  });

  type GameQuestionsFiltersButtonVm = ComponentVm & { playHighlight: () => Promise<void> };

  it("should call useQuestionCardHighlight().animate with the button element when playHighlight is called.", async() => {
    const vm = getWrapperVm<GameQuestionsFiltersButtonVm>(wrapper);
    const buttonElement = wrapper.find("button").element as HTMLElement;

    await vm.playHighlight();

    expect(useQuestionCardHighlightMock.instance.animate).toHaveBeenCalledExactlyOnceWith([buttonElement]);
  });

  it("should not call useQuestionCardHighlight().animate when playHighlight is called and the button element reference is null.", async() => {
    const vm = getWrapperVm<GameQuestionsFiltersButtonVm>(wrapper);
    vm.$.refs.buttonElementReference = null;

    await vm.playHighlight();

    expect(useQuestionCardHighlightMock.instance.animate).not.toHaveBeenCalled();
  });
});