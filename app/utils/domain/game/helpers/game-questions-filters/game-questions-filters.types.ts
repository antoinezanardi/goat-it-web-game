import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

/**
 * Subset of the random-question request body narrowed by the active game settings.
 *
 * Omitted fields leave the corresponding filter unrestricted.
 */
type GameSettingsFetchFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "cognitiveDifficulties" | "categories" | "themeIds">;

/**
 * One question-filter group that can both narrow the random-question request and report its UI activity.
 */
type GameQuestionsFilterGroupDefinition = {
  /**
   * Returns the fetch fields this group narrows, or an empty object when the group is unrestricted for these settings.
   */
  buildFetchFilter: (settings: GameSettings, activeThemeIds: readonly string[]) => GameSettingsFetchFilters;
  /**
   * Returns whether this group currently narrows the request, so the filters UI reflects the same conditions as `buildFetchFilter`.
   */
  isActiveInQuestionFiltersUi: (settings: GameSettings, activeThemeIds: readonly string[]) => boolean;
};

export type { GameQuestionsFilterGroupDefinition, GameSettingsFetchFilters };