import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameSettingsCognitiveDifficultiesFilter } from "#components";
import type { GameSettingsFilterMultiSelect } from "#components";

import type { GameSettingsCognitiveDifficultiesFilterProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsCognitiveDifficultiesFilter/game-settings-cognitive-difficulties-filter.types";

describe("GameSettingsCognitiveDifficultiesFilter Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSettingsCognitiveDifficultiesFilterProps: GameSettingsCognitiveDifficultiesFilterProps = {
    modelValue: ["easy", "medium", "hard"],
  };

  async function mountGameSettingsCognitiveDifficultiesFilter(options: MountSuspendedOptions<typeof GameSettingsCognitiveDifficultiesFilter> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsCognitiveDifficultiesFilter, { props: defaultGameSettingsCognitiveDifficultiesFilterProps, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsCognitiveDifficultiesFilter();
  });

  it("should render GameSettingsCognitiveDifficultiesFilter when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the cognitive difficulties filter with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-cognitive-difficulties-filter']").exists()).toBe(true);
  });

  it("should render the generic filter multi select component when mounted.", () => {
    expect(wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" }).exists()).toBe(true);
  });

  it("should pass the cognitive difficulty label translation key to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("label")).toBe("game.settings.cognitiveDifficulties.label");
  });

  it("should pass the cognitive difficulty label icon to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("labelIcon")).toBe("i-lucide-gauge");
  });

  it("should pass the all selected translation key to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("allSelectedLabel")).toBe("game.settings.cognitiveDifficulties.allSelected");
  });

  it("should configure the labels summary mode on the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("summaryMode")).toBe("labels");
  });

  it("should pass the localized cognitive difficulty options with their icons and colors to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("options")).toStrictEqual([
      { color: "success", icon: "i-lucide-brain", label: "game.settings.cognitiveDifficulties.options.easy", value: "easy" },
      { color: "warning", icon: "i-lucide-brain-cog", label: "game.settings.cognitiveDifficulties.options.medium", value: "medium" },
      { color: "error", icon: "i-lucide-brain-circuit", label: "game.settings.cognitiveDifficulties.options.hard", value: "hard" },
    ]);
  });

  it("should bind the model value to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["easy", "medium", "hard"]);
  });

  it("should emit update:modelValue in option order when the generic filter emits a selection.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["hard", "easy"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["easy", "hard"]]]);
  });

  it("should ignore unknown values when the generic filter emits a selection.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["hard", "unknown"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["hard"]]]);
  });
});