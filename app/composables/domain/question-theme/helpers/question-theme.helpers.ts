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

export { getThemeIcon, resolveThemeColor };