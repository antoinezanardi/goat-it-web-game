import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { describe, expect, it } from "vitest";

import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { buildGameSettingsFetchFilters } from "@/composables/domain/useGame/helpers/game-questions-filters/game-questions-filters.helpers";
import type { GameSettingsFetchFilters } from "@/composables/domain/useGame/helpers/game-questions-filters/game-questions-filters.types";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

const UNRESTRICTED_SETTINGS_FIELDS: Partial<GameSettings> = {
  categories: [...QUESTION_CATEGORIES],
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
  isAdultContentEnabled: true,
  themeIds: undefined,
};

describe(buildGameSettingsFetchFilters, () => {
  it.each<{
    case: string;
    settings: Partial<GameSettings>;
    activeThemeIds: readonly string[];
    expected: GameSettingsFetchFilters;
  }>([
    {
      case: "adult content is disabled",
      settings: { isAdultContentEnabled: false },
      activeThemeIds: [],
      expected: { isAdultContent: false },
    },
    {
      case: "adult content is enabled",
      settings: { isAdultContentEnabled: true },
      activeThemeIds: [],
      expected: {},
    },
    {
      case: "only a subset of cognitive difficulties is selected",
      settings: { cognitiveDifficulties: ["easy"] },
      activeThemeIds: [],
      expected: { cognitiveDifficulties: ["easy"] },
    },
    {
      case: "every cognitive difficulty is selected",
      settings: { cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES] },
      activeThemeIds: [],
      expected: {},
    },
    {
      case: "only a subset of categories is selected",
      settings: { categories: ["trivia"] },
      activeThemeIds: [],
      expected: { categories: ["trivia"] },
    },
    {
      case: "every category is selected",
      settings: { categories: [...QUESTION_CATEGORIES] },
      activeThemeIds: [],
      expected: {},
    },
    {
      case: "theme ids are saved with no active theme catalog",
      settings: { themeIds: ["theme-a"] },
      activeThemeIds: [],
      expected: { themeIds: ["theme-a"] },
    },
    {
      case: "no theme ids are saved with no active theme catalog",
      settings: { themeIds: undefined },
      activeThemeIds: [],
      expected: {},
    },
    {
      case: "a strict subset of the active theme catalog is selected",
      settings: { themeIds: ["theme-a"] },
      activeThemeIds: ["theme-a", "theme-b"],
      expected: { themeIds: ["theme-a"] },
    },
    {
      case: "every active theme is selected",
      settings: { themeIds: ["theme-a", "theme-b"] },
      activeThemeIds: ["theme-a", "theme-b"],
      expected: {},
    },
    {
      case: "every saved theme id is stale",
      settings: { themeIds: ["stale-theme"] },
      activeThemeIds: ["theme-a", "theme-b"],
      expected: {},
    },
    {
      case: "no theme ids are saved and an active theme catalog is available",
      settings: { themeIds: undefined },
      activeThemeIds: ["theme-a", "theme-b"],
      expected: {},
    },
    {
      case: "all filter groups are narrowed",
      settings: {
        categories: ["trivia"],
        cognitiveDifficulties: ["hard"],
        isAdultContentEnabled: false,
        themeIds: ["theme-b"],
      },
      activeThemeIds: ["theme-a", "theme-b"],
      expected: {
        categories: ["trivia"],
        cognitiveDifficulties: ["hard"],
        isAdultContent: false,
        themeIds: ["theme-b"],
      },
    },
  ])("should build the expected fetch filters when $case.", ({ settings, activeThemeIds, expected }) => {
    expect(buildGameSettingsFetchFilters(createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, ...settings }), activeThemeIds)).toStrictEqual(expected);
  });
});