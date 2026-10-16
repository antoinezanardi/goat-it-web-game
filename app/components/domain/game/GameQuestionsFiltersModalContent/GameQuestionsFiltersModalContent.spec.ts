import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameQuestionsFiltersModalContent } from "#components";
import type {
  GameQuestionsFiltersCategoryFilter,
  GameQuestionsFiltersThemeFilter,
  GameSettingsAdultContentSwitch,
  GameSettingsCognitiveDifficultiesFilter,
} from "#components";

import type { GameQuestionsFiltersModalContentProps } from "@/components/domain/game/GameQuestionsFiltersModalContent/game-questions-filters-modal-content.types";

describe("GameQuestionsFiltersModalContent Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersModalContentProps: GameQuestionsFiltersModalContentProps = {
    draft: { isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], categories: ["trivia", "lexicon", "riddle", "explanation"], themeIds: [] },
  };

  async function mountGameQuestionsFiltersModalContent(options: MountSuspendedOptions<typeof GameQuestionsFiltersModalContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersModalContent, {
      props: defaultGameQuestionsFiltersModalContentProps,
      global: { plugins: [createTestingPinia()] },
      shallow: false,
      ...options,
    });
  }

  function getAdultContentSwitch(): VueWrapper<InstanceType<typeof GameSettingsAdultContentSwitch>> {
    return wrapper.findComponent<typeof GameSettingsAdultContentSwitch>({ name: "GameSettingsAdultContentSwitch" });
  }

  function getCognitiveDifficultiesFilter(): VueWrapper<InstanceType<typeof GameSettingsCognitiveDifficultiesFilter>> {
    return wrapper.findComponent<typeof GameSettingsCognitiveDifficultiesFilter>({ name: "GameSettingsCognitiveDifficultiesFilter" });
  }

  function getCategoryFilter(): VueWrapper<InstanceType<typeof GameQuestionsFiltersCategoryFilter>> {
    return wrapper.findComponent<typeof GameQuestionsFiltersCategoryFilter>({ name: "GameQuestionsFiltersCategoryFilter" });
  }

  function getThemeFilter(): VueWrapper<InstanceType<typeof GameQuestionsFiltersThemeFilter>> {
    return wrapper.findComponent<typeof GameQuestionsFiltersThemeFilter>({ name: "GameQuestionsFiltersThemeFilter" });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionsFiltersModalContent();
  });

  it("should render GameQuestionsFiltersModalContent when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the modal body root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-modal']").exists()).toBe(true);
  });

  it("should render the separator between the filters when mounted.", () => {
    expect(wrapper.findComponent({ name: "USeparator" }).exists()).toBe(true);
  });

  it("should render the adult content switch component when mounted.", () => {
    expect(getAdultContentSwitch().exists()).toBe(true);
  });

  it("should render the cognitive difficulties filter component when mounted.", () => {
    expect(getCognitiveDifficultiesFilter().exists()).toBe(true);
  });

  it("should pass the draft adult content value to the switch when mounted.", async() => {
    await wrapper.setProps({
      draft: { isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"], categories: ["trivia", "lexicon", "riddle", "explanation"], themeIds: [] },
    });

    expect(getAdultContentSwitch().props("isAdultContentEnabled")).toBe(true);
  });

  it("should pass the draft cognitive difficulties to the filter when mounted.", async() => {
    await wrapper.setProps({ draft: { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["trivia", "lexicon", "riddle", "explanation"], themeIds: [] } });

    expect(getCognitiveDifficultiesFilter().props("modelValue")).toStrictEqual(["easy"]);
  });

  it("should emit update:isAdultContentEnabled when the switch changes.", async() => {
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await nextTick();

    expect(wrapper.emitted("update:isAdultContentEnabled")).toStrictEqual([[true]]);
  });

  it("should emit update:cognitiveDifficulties when the filter changes.", async() => {
    getWrapperVm(getCognitiveDifficultiesFilter()).$emit("update:modelValue", ["easy"]);
    await nextTick();

    expect(wrapper.emitted("update:cognitiveDifficulties")).toStrictEqual([[["easy"]]]);
  });

  it("should render the theme filter component when mounted.", () => {
    expect(getThemeFilter().exists()).toBe(true);
  });

  it("should render the category filter component when mounted.", () => {
    expect(getCategoryFilter().exists()).toBe(true);
  });

  it("should pass the draft theme ids to the theme filter when mounted.", async() => {
    await wrapper.setProps({
      draft: { isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], categories: ["trivia", "lexicon", "riddle", "explanation"], themeIds: ["theme-a"] },
    });

    expect(getThemeFilter().props("modelValue")).toStrictEqual(["theme-a"]);
  });

  it("should pass the draft categories to the category filter when mounted.", async() => {
    await wrapper.setProps({ draft: { isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], categories: ["trivia"], themeIds: [] } });

    expect(getCategoryFilter().props("modelValue")).toStrictEqual(["trivia"]);
  });

  it("should emit update:themeIds when the theme filter changes.", async() => {
    getWrapperVm(getThemeFilter()).$emit("update:modelValue", ["theme-a"]);
    await nextTick();

    expect(wrapper.emitted("update:themeIds")).toStrictEqual([[["theme-a"]]]);
  });

  it("should emit update:categories when the category filter changes.", async() => {
    getWrapperVm(getCategoryFilter()).$emit("update:modelValue", ["trivia"]);
    await nextTick();

    expect(wrapper.emitted("update:categories")).toStrictEqual([[["trivia"]]]);
  });
});