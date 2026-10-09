import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";

import { GameQuestionsFiltersThemeFilter } from "#components";
import type { GameSettingsFilterMultiSelect } from "#components";

import type { GameQuestionsFiltersThemeFilterProps } from "@/components/domain/game/GameQuestionsFiltersModalContent/GameQuestionsFiltersThemeFilter/game-questions-filters-theme-filter.types";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

describe("GameQuestionsFiltersThemeFilter Component", () => {
  type GameQuestionsFiltersThemeFilterVm = ComponentVm & { selectedThemeIds: string[] };

  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersThemeFilterProps: GameQuestionsFiltersThemeFilterProps = {
    modelValue: ["theme-a", "theme-b"],
  };

  const activeThemes = [
    createFakeQuestionTheme({ id: "theme-a", slug: "cinema-series", label: "Cinema", status: "active" }),
    createFakeQuestionTheme({ id: "theme-b", slug: "music", label: "Music", status: "active" }),
  ];

  async function mountGameQuestionsFiltersThemeFilter(options: MountSuspendedOptions<typeof GameQuestionsFiltersThemeFilter> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersThemeFilter, {
      props: defaultGameQuestionsFiltersThemeFilterProps,
      global: { plugins: [createTestingPinia()] },
      ...options,
    });
  }

  function setCatalog(themes: ReturnType<typeof createFakeQuestionTheme>[]): void {
    mockStore(useQuestionThemesStore).questionThemes = themes;
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionsFiltersThemeFilter();
  });

  it("should render GameQuestionsFiltersThemeFilter when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the theme filter root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter']").exists()).toBe(true);
  });

  it("should render the unavailable status when no active theme is available.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-status']").exists()).toBe(true);
  });

  it("should render the unavailable status icon when no active theme is available.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-status-icon']").exists()).toBe(true);
  });

  it("should render the loading translation key in the status when the catalog is loading.", async() => {
    setCatalog([]);
    await nextTick();

    expect(wrapper.get("[data-testid='game-questions-filters-theme-filter-status']").text()).toBe("game.questionsFilters.themes.loading");
  });

  it("should render the unavailable translation key in the status when the catalog is unavailable.", async() => {
    setCatalog([]);
    mockStore(useQuestionThemesStore).fetchStatus = "error";
    await nextTick();

    expect(wrapper.get("[data-testid='game-questions-filters-theme-filter-status']").text()).toBe("game.questionsFilters.themes.unavailable");
  });

  it("should not render the generic filter when no active theme is available.", () => {
    expect(wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" }).exists()).toBe(false);
  });

  it("should render the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();

    expect(wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" }).exists()).toBe(true);
  });

  it("should render the generic filter root with the correct data-testid when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();

    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-select']").exists()).toBe(true);
  });

  it("should pass the theme label translation key to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("label")).toBe("game.questionsFilters.themes.label");
  });

  it("should pass the theme label icon to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("labelIcon")).toBe("i-lucide-palette");
  });

  it("should pass the all selected translation key to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("allSelectedLabel")).toBe("game.questionsFilters.themes.allSelected");
  });

  it("should configure the count summary mode on the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("summaryMode")).toBe("count");
  });

  it("should pass the theme select test id to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("selectTestId")).toBe("game-questions-filters-theme-filter-input");
  });

  it("should pass the theme summary test id to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("summaryTestId")).toBe("game-questions-filters-theme-filter-summary");
  });

  it("should pass the active theme options with their labels and icons to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("options")).toStrictEqual([
      { icon: "i-lucide-clapperboard", label: "Cinema", value: "theme-a" },
      { icon: "i-lucide-music", label: "Music", value: "theme-b" },
    ]);
  });

  it("should bind the model value to the generic filter when active themes are available.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should render every active theme as selected when the model value is empty and a catalog is available.", async() => {
    setCatalog(activeThemes);
    await wrapper.setProps({ modelValue: [] });
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should render only the still-active theme ids when the model value holds stale ids and a catalog is available.", async() => {
    setCatalog(activeThemes);
    await wrapper.setProps({ modelValue: ["theme-a", "stale"] });
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["theme-a"]);
  });

  it("should render every active theme when every saved theme id is stale and a catalog is available.", async() => {
    setCatalog(activeThemes);
    await wrapper.setProps({ modelValue: ["stale"] });
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });

    expect(filter.props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should keep the model value unchanged when no catalog is available.", async() => {
    await wrapper.setProps({ modelValue: ["theme-a"] });
    await nextTick();
    const vm = getWrapperVm<GameQuestionsFiltersThemeFilterVm>(wrapper);

    expect(vm.selectedThemeIds).toStrictEqual(["theme-a"]);
  });

  it("should emit update:modelValue in catalog order when the generic filter emits a selection.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["theme-b", "theme-a"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["theme-a", "theme-b"]]]);
  });

  it("should ignore unknown theme ids when the generic filter emits a selection.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    const filter = wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
    getWrapperVm(filter).$emit("update:modelValue", ["theme-a", "unknown"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["theme-a"]]]);
  });

  it("should render the refresh failure status when the catalog is stale.", async() => {
    setCatalog(activeThemes);
    await nextTick();
    mockStore(useQuestionThemesStore).fetchStatus = "error";
    await nextTick();

    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-refresh-error']").exists()).toBe(true);
  });
});