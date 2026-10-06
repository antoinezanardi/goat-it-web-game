import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GameSettingsCognitiveDifficultiesFilter } from "#components";
import type { GameSettingsFilterMultiSelect } from "#components";

import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

describe("GameSettingsCognitiveDifficultiesFilter Component", () => {
  let wrapper: VueWrapper;

  async function mountGameSettingsCognitiveDifficultiesFilter(options: MountSuspendedOptions<typeof GameSettingsCognitiveDifficultiesFilter> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsCognitiveDifficultiesFilter, { plugins: [createTestingPinia()], ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsCognitiveDifficultiesFilter();
    mockStore(useGameSettingsStore).settings = createFakeGameSettings();
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

  it("should pass the all selected translation key to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("allSelectedLabel")).toBe("game.settings.cognitiveDifficulties.allSelected");
  });

  it("should configure the labels summary mode on the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("summaryMode")).toBe("labels");
  });

  it("should pass the localized cognitive difficulty options with their icons to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("options")).toStrictEqual([
      { icon: "i-lucide-brain", label: "game.settings.cognitiveDifficulties.options.easy", value: "easy" },
      { icon: "i-lucide-brain-cog", label: "game.settings.cognitiveDifficulties.options.medium", value: "medium" },
      { icon: "i-lucide-brain-circuit", label: "game.settings.cognitiveDifficulties.options.hard", value: "hard" },
    ]);
  });

  it("should bind the persisted cognitive difficulties to the generic filter when mounted.", () => {
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["easy", "medium", "hard"]);
  });

  it("should set the cognitive difficulties on the store in option order when the generic filter emits a selection.", () => {
    const store = mockStore(useGameSettingsStore);
    const setCognitiveDifficultiesSpy = vi.spyOn(store, "setCognitiveDifficulties");
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["hard", "easy"]);

    expect(setCognitiveDifficultiesSpy).toHaveBeenCalledExactlyOnceWith(["easy", "hard"]);
  });

  it("should ignore unknown values when the generic filter emits a selection.", () => {
    const store = mockStore(useGameSettingsStore);
    const setCognitiveDifficultiesSpy = vi.spyOn(store, "setCognitiveDifficulties");
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["hard", "unknown"]);

    expect(setCognitiveDifficultiesSpy).toHaveBeenCalledExactlyOnceWith(["hard"]);
  });
});