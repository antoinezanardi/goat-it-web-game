import { HEX_COLOR_REGEX } from "@goat-it/schemas/shared/constants";

import { NEUTRAL_GREY_FALLBACK_THEME_COLOR, QUESTION_THEME_SLUG_ICON_MAP, QUESTION_THEME_UNKNOWN_ICON } from "~/composables/domain/question-theme/constants/question-theme.constants";

function getThemeIcon(slug: string): string {
  return QUESTION_THEME_SLUG_ICON_MAP[slug] ?? QUESTION_THEME_UNKNOWN_ICON;
}

function resolveThemeColor(color?: string): string {
  if (color === undefined || !HEX_COLOR_REGEX.test(color)) {
    return NEUTRAL_GREY_FALLBACK_THEME_COLOR;
  }
  return color;
}

function normalizeThemeSelection(themeIds: readonly string[], activeThemeIds: readonly string[]): string[] {
  if (activeThemeIds.length === 0) {
    return [...themeIds];
  }
  const activeSelection = activeThemeIds.filter(themeId => themeIds.includes(themeId));
  if (activeSelection.length === 0) {
    return [...activeThemeIds];
  }
  return activeSelection;
}

export { getThemeIcon, normalizeThemeSelection, resolveThemeColor };