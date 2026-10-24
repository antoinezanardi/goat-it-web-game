import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { GameQuestionsFiltersThemeFilter } from "#components";
import type { GameSettingsFilterMultiSelect, UIcon } from "#components";

import type { GameQuestionsFiltersThemeFilterProps } from "@/components/domain/game/GameQuestionsFiltersModalContent/GameQuestionsFiltersThemeFilter/game-questions-filters-theme-filter.types";

describe("GameQuestionsFiltersThemeFilter Component", () => {
  type GameQuestionsFiltersThemeFilterVm = ComponentVm & { selectedThemeIds: string[] };

  let wrapper: VueWrapper;

  const activeThemes = [
    createFakeQuestionTheme({ color: "#E11D48", id: "theme-a", slug: "cinema-series", label: "Cinema", status: "active" }),
    createFakeQuestionTheme({ color: "#2563EB", id: "theme-b", slug: "music", label: "Music", status: "active" }),
  ];

  const defaultGameQuestionsFiltersThemeFilterProps: GameQuestionsFiltersThemeFilterProps = {
    modelValue: ["theme-a", "theme-b"],
    activeThemeIds: ["theme-a", "theme-b"],
    activeThemes,
    catalogStatus: "ready",
    isThemesCatalogAvailable: true,
  };

  async function mountGameQuestionsFiltersThemeFilter(options: MountSuspendedOptions<typeof GameQuestionsFiltersThemeFilter> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersThemeFilter, { props: defaultGameQuestionsFiltersThemeFilterProps, ...options });
  }

  function getGenericFilter(): VueWrapper<InstanceType<typeof GameSettingsFilterMultiSelect>> {
    return wrapper.findComponent<typeof GameSettingsFilterMultiSelect>({ name: "GameSettingsFilterMultiSelect" });
  }

  function getStatusText(): string {
    return wrapper.get("[data-testid='game-questions-filters-theme-filter-status']").text();
  }

  function getStatusIcon(): VueWrapper<InstanceType<typeof UIcon>> {
    return wrapper.findComponent<typeof UIcon>("[data-testid='game-questions-filters-theme-filter-status-icon']");
  }

  function getStatusIconElement(): HTMLElement {
    return wrapper.get<HTMLElement>("[data-testid='game-questions-filters-theme-filter-status-icon']").element;
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

  it("should render the generic filter when the themes catalog is available.", () => {
    expect(getGenericFilter().exists()).toBe(true);
  });

  it("should render the generic filter root with the correct data-testid when the themes catalog is available.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-select']").exists()).toBe(true);
  });

  it("should pass the theme label translation key to the generic filter when the themes catalog is available.", () => {
    expect(getGenericFilter().props("label")).toBe("game.questionsFilters.themes.label");
  });

  it("should pass the theme label icon to the generic filter when the themes catalog is available.", () => {
    expect(getGenericFilter().props("labelIcon")).toBe("i-lucide-palette");
  });

  it("should pass the all selected translation key to the generic filter when the themes catalog is available.", () => {
    expect(getGenericFilter().props("allSelectedLabel")).toBe("game.questionsFilters.themes.allSelected");
  });

  it("should pass the active theme options with their labels, icons and colors to the generic filter when the themes catalog is available.", () => {
    expect(getGenericFilter().props("options")).toStrictEqual([
      { color: "#E11D48", icon: "i-lucide-clapperboard", label: "Cinema", value: "theme-a" },
      { color: "#2563EB", icon: "i-lucide-music", label: "Music", value: "theme-b" },
    ]);
  });

  it("should bind the model value to the generic filter when the themes catalog is available.", () => {
    expect(getGenericFilter().props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should render every active theme as selected when the model value is empty.", async() => {
    await wrapper.setProps({ modelValue: [] });

    expect(getGenericFilter().props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should render every active theme as selected when the model value is undefined.", async() => {
    await wrapper.setProps({ modelValue: undefined });

    expect(getGenericFilter().props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should render only the still-active theme ids when the model value holds stale ids.", async() => {
    await wrapper.setProps({ modelValue: ["theme-a", "stale"] });

    expect(getGenericFilter().props("modelValue")).toStrictEqual(["theme-a"]);
  });

  it("should render every active theme when every saved theme id is stale.", async() => {
    await wrapper.setProps({ modelValue: ["stale"] });

    expect(getGenericFilter().props("modelValue")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should keep the model value unchanged when the catalog is unavailable.", async() => {
    await wrapper.setProps({
      modelValue: ["theme-a"],
      activeThemeIds: [],
      activeThemes: [],
      catalogStatus: "unavailable",
      isThemesCatalogAvailable: false,
    });
    const vm = getWrapperVm<GameQuestionsFiltersThemeFilterVm>(wrapper);

    expect(vm.selectedThemeIds).toStrictEqual(["theme-a"]);
  });

  it("should fall back to an empty selection when the model value is undefined and the catalog is unavailable.", async() => {
    await wrapper.setProps({
      modelValue: undefined,
      activeThemeIds: [],
      activeThemes: [],
      catalogStatus: "unavailable",
      isThemesCatalogAvailable: false,
    });
    const vm = getWrapperVm<GameQuestionsFiltersThemeFilterVm>(wrapper);

    expect(vm.selectedThemeIds).toStrictEqual([]);
  });

  it("should emit update:modelValue in catalog order when the generic filter emits a selection.", () => {
    getWrapperVm(getGenericFilter()).$emit("update:modelValue", ["theme-b", "theme-a"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["theme-a", "theme-b"]]]);
  });

  it("should ignore unknown theme ids when the generic filter emits a selection.", () => {
    getWrapperVm(getGenericFilter()).$emit("update:modelValue", ["theme-a", "unknown"]);

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["theme-a"]]]);
  });

  it("should not render the generic filter when the themes catalog is unavailable.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "unavailable" });

    expect(getGenericFilter().exists()).toBe(false);
  });

  it("should render the unavailable status container when the themes catalog is unavailable.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "unavailable" });

    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-status']").exists()).toBe(true);
  });

  it("should render the loading translation key in the status when the catalog status is loading.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "loading" });

    expect(getStatusText()).toBe("game.questionsFilters.themes.loading");
  });

  it("should render the unavailable translation key in the status when the catalog status is unavailable.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "unavailable" });

    expect(getStatusText()).toBe("game.questionsFilters.themes.unavailable");
  });

  it("should render the loader status icon when the catalog status is loading.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "loading" });

    expect(getStatusIcon().props("name")).toBe("i-lucide-loader-circle");
  });

  it("should spin the status icon when the catalog status is loading.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "loading" });

    expect(getStatusIconElement().classList.contains("animate-spin")).toBe(true);
  });

  it("should render the alert status icon when the catalog status is unavailable.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "unavailable" });

    expect(getStatusIcon().props("name")).toBe("i-lucide-triangle-alert");
  });

  it("should not spin the status icon when the catalog status is unavailable.", async() => {
    await wrapper.setProps({ isThemesCatalogAvailable: false, activeThemeIds: [], activeThemes: [], catalogStatus: "unavailable" });

    expect(getStatusIconElement().classList.contains("animate-spin")).toBe(false);
  });

  it("should not render the refresh failure status when the catalog status is ready.", () => {
    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-refresh-error']").exists()).toBe(false);
  });

  it("should render the refresh failure status when the catalog status is stale.", async() => {
    await wrapper.setProps({ catalogStatus: "stale" });

    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-refresh-error']").exists()).toBe(true);
  });

  it("should render the refresh failure translation key when the catalog status is stale.", async() => {
    await wrapper.setProps({ catalogStatus: "stale" });

    expect(wrapper.get("[data-testid='game-questions-filters-theme-filter-refresh-error']").text()).toBe("game.questionsFilters.themes.refreshFailed");
  });

  it("should not render the refresh failure status when the catalog status is refreshing.", async() => {
    await wrapper.setProps({ catalogStatus: "refreshing" });

    expect(wrapper.find("[data-testid='game-questions-filters-theme-filter-refresh-error']").exists()).toBe(false);
  });
});