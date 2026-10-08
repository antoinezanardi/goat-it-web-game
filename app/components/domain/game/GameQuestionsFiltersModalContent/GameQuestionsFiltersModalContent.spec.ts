import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameQuestionsFiltersModalContent } from "#components";
import type { GameSettingsAdultContentSwitch, GameSettingsCognitiveDifficultiesFilter } from "#components";

import type { GameQuestionsFiltersModalContentProps } from "@/components/domain/game/GameQuestionsFiltersModalContent/game-questions-filters-modal-content.types";

describe("GameQuestionsFiltersModalContent Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersModalContentProps: GameQuestionsFiltersModalContentProps = {
    draft: { isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] },
  };

  async function mountGameQuestionsFiltersModalContent(options: MountSuspendedOptions<typeof GameQuestionsFiltersModalContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersModalContent, { props: defaultGameQuestionsFiltersModalContentProps, shallow: false, ...options });
  }

  function getAdultContentSwitch(): VueWrapper<InstanceType<typeof GameSettingsAdultContentSwitch>> {
    return wrapper.findComponent<typeof GameSettingsAdultContentSwitch>({ name: "GameSettingsAdultContentSwitch" });
  }

  function getCognitiveDifficultiesFilter(): VueWrapper<InstanceType<typeof GameSettingsCognitiveDifficultiesFilter>> {
    return wrapper.findComponent<typeof GameSettingsCognitiveDifficultiesFilter>({ name: "GameSettingsCognitiveDifficultiesFilter" });
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
    await wrapper.setProps({ draft: { isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] } });

    expect(getAdultContentSwitch().props("isAdultContentEnabled")).toBe(true);
  });

  it("should pass the draft cognitive difficulties to the filter when mounted.", async() => {
    await wrapper.setProps({ draft: { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] } });

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
});