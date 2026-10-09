import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameQuestionsFiltersCategoryFilter } from "#components";
import type { GameSettingsFilterMultiSelect } from "#components";

import type { GameQuestionsFiltersCategoryFilterProps } from "@/components/domain/game/GameQuestionsFiltersModalContent/GameQuestionsFiltersCategoryFilter/game-questions-filters-category-filter.types";

describe("GameQuestionsFiltersCategoryFilter Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersCategoryFilterProps: GameQuestionsFiltersCategoryFilterProps = {
    modelValue: ["trivia", "lexicon", "riddle", "explanation"],
  };

  async function mountGameQuestionsFiltersCategoryFilter(options: MountSuspendedOptions<typeof GameQuestionsFiltersCategoryFilter> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersCategoryFilter, { props: defaultGameQuestionsFiltersCategoryFilterProps, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionsFiltersCategoryFilter();
  });

  it("should render GameQuestionsFiltersCategoryFilter when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the category filter with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-category-filter']").exists()).toBe(true);
  });

  it("should render the generic filter multi select component when mounted.", () => {
    expect(wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" }).exists()).toBe(true);
  });

  it("should pass the category label translation key to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("label")).toBe("game.questionsFilters.categories.label");
  });

  it("should pass the category label icon to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("labelIcon")).toBe("i-lucide-tag");
  });

  it("should pass the all selected translation key to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("allSelectedLabel")).toBe("game.questionsFilters.categories.allSelected");
  });

  it("should configure the count summary mode on the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("summaryMode")).toBe("count");
  });

  it("should pass the category select test id to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("selectTestId")).toBe("game-questions-filters-category-filter-input");
  });

  it("should pass the category summary test id to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("summaryTestId")).toBe("game-questions-filters-category-filter-summary");
  });

  it("should pass the localized category options with their icons to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("options")).toStrictEqual([
      { icon: "i-lucide-sparkle", label: "questions.category.trivia", value: "trivia" },
      { icon: "i-lucide-languages", label: "questions.category.lexicon", value: "lexicon" },
      { icon: "i-lucide-puzzle", label: "questions.category.riddle", value: "riddle" },
      { icon: "i-lucide-atom", label: "questions.category.explanation", value: "explanation" },
    ]);
  });

  it("should bind the model value to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["trivia", "lexicon", "riddle", "explanation"]);
  });

  it("should emit update:modelValue in schema order when the generic filter emits a selection.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["riddle", "trivia"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["trivia", "riddle"]]]);
  });

  it("should ignore unknown values when the generic filter emits a selection.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["riddle", "unknown"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["riddle"]]]);
  });
});