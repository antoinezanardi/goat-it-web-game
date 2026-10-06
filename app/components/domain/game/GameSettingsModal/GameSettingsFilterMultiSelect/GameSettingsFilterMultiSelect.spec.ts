import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { useOverlayMock } from "~~/tests/unit/setup/nuxt/composables/use-overlay.nuxt.unit-setup";
import type { UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

import { GameSettingsFilterMultiSelect } from "#components";
import type { USelectMenu } from "#components";

import {
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ACTION_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_DESCRIPTION_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ICON,
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_TITLE_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_KEEP_ACTION_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_SEARCH_PLACEHOLDER_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_SELECTED_COUNT_KEY,
} from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.constants";
import type { GameSettingsFilterMultiSelectProps } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";

function getCreatedModalInstance(): UseOverlayCreateReturnValue {
  const createResult = useOverlayMock.instance.create.mock.results[0];

  if (createResult?.type !== "return") {
    throw new Error("Expected overlay.create() to have returned a modal instance");
  }
  return createResult.value;
}

describe("GameSettingsFilterMultiSelect Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSettingsFilterMultiSelectProps: GameSettingsFilterMultiSelectProps = {
    allSelectedLabel: "All difficulties",
    label: "Cognitive difficulty",
    modelValue: ["easy", "medium", "hard"],
    options: [
      { icon: "i-lucide-brain", label: "Easy", value: "easy" },
      { icon: "i-lucide-brain-cog", label: "Medium", value: "medium" },
      { icon: "i-lucide-brain-circuit", label: "Hard", value: "hard" },
    ],
    summaryMode: "labels",
  };

  async function mountGameSettingsFilterMultiSelect(options: MountSuspendedOptions<typeof GameSettingsFilterMultiSelect> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsFilterMultiSelect, { props: defaultGameSettingsFilterMultiSelectProps, plugins: [createTestingPinia()], ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsFilterMultiSelect();
  });

  it("should render GameSettingsFilterMultiSelect when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the filter root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-filter-multi-select']").exists()).toBe(true);
  });

  it("should render the filter label when mounted.", () => {
    expect(wrapper.get("[data-testid='game-settings-filter-multi-select-label']").text()).toBe("Cognitive difficulty");
  });

  it("should render the multi select input with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-filter-multi-select-input']").exists()).toBe(true);
  });

  it("should render the summary with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-filter-multi-select-summary']").exists()).toBe(true);
  });

  it("should render the USelectMenu component when mounted.", () => {
    expect(wrapper.findComponent({ name: "USelectMenu" }).exists()).toBe(true);
  });

  it("should pass the options as select menu items with their icons when mounted.", () => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });

    expect(selectMenu.props("items")).toStrictEqual([
      { icon: "i-lucide-brain", label: "Easy", value: "easy" },
      { icon: "i-lucide-brain-cog", label: "Medium", value: "medium" },
      { icon: "i-lucide-brain-circuit", label: "Hard", value: "hard" },
    ]);
  });

  it("should enable multiple selection on the select menu when mounted.", () => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });

    expect(selectMenu.props("multiple")).toBe(true);
  });

  it("should bind the stable option values to the select menu when mounted.", () => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });

    expect(selectMenu.props("valueKey")).toBe("value");
  });

  it("should pass the search placeholder translation key to the select menu when mounted.", () => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });

    expect(selectMenu.props("searchInput")).toStrictEqual({ placeholder: GAME_SETTINGS_FILTER_MULTI_SELECT_SEARCH_PLACEHOLDER_KEY });
  });

  it("should render the all selected label when every option is selected.", () => {
    expect(wrapper.get("[data-testid='game-settings-filter-multi-select-summary']").text()).toBe("All difficulties");
  });

  it("should render the selected labels joined when a subset of options is selected.", async() => {
    await wrapper.setProps({ modelValue: ["easy", "hard"] });

    expect(wrapper.get("[data-testid='game-settings-filter-multi-select-summary']").text()).toBe("Easy, Hard");
  });

  it("should render the selected count translation key when the summary mode is count.", async() => {
    await wrapper.setProps({ modelValue: ["easy"], summaryMode: "count" });

    expect(wrapper.get("[data-testid='game-settings-filter-multi-select-summary']").text()).toBe(GAME_SETTINGS_FILTER_MULTI_SELECT_SELECTED_COUNT_KEY);
  });

  it("should emit the selected values when the select menu emits a non-empty selection.", async() => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });
    getWrapperVm(selectMenu).$emit("update:modelValue", ["easy", "medium"]);
    await flushPromises();

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["easy", "medium"]]]);
  });

  it("should open the confirmation dialog when the select menu emits an empty selection.", async() => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });
    getWrapperVm(selectMenu).$emit("update:modelValue", []);
    await flushPromises();

    expect(useOverlayMock.instance.create).toHaveBeenCalledExactlyOnceWith(
      expect.any(Object),
      expect.objectContaining({
        props: {
          closeButtonLabel: GAME_SETTINGS_FILTER_MULTI_SELECT_KEEP_ACTION_KEY,
          description: GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_DESCRIPTION_KEY,
          disableShortcuts: true,
          dismissible: false,
          icon: GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ICON,
          iconClass: "text-warning",
          primaryButtonLabel: GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ACTION_KEY,
          title: GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_TITLE_KEY,
        },
      }),
    );
  });

  it("should emit every option value when the confirmation dialog is confirmed.", async() => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });
    getWrapperVm(selectMenu).$emit("update:modelValue", []);
    await flushPromises();
    getCreatedModalInstance().close(true);
    await flushPromises();

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["easy", "medium", "hard"]]]);
  });

  it("should emit the previous selection when the confirmation dialog is canceled.", async() => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });
    getWrapperVm(selectMenu).$emit("update:modelValue", []);
    await flushPromises();
    getCreatedModalInstance().close(false);
    await flushPromises();

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["easy", "medium", "hard"]]]);
  });

  it("should render the previous selection summary when the confirmation dialog is canceled.", async() => {
    const selectMenu = wrapper.findComponent<typeof USelectMenu>({ name: "USelectMenu" });
    getWrapperVm(selectMenu).$emit("update:modelValue", []);
    await flushPromises();
    getCreatedModalInstance().close(false);
    await flushPromises();

    expect(wrapper.get("[data-testid='game-settings-filter-multi-select-summary']").text()).toBe("All difficulties");
  });
});