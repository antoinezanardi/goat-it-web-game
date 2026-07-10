import { QUESTION_THEME_SLUG_ICON_MAP, QUESTION_THEME_UNKNOWN_ICON } from "~/composables/domain/question-theme/constants/question-theme.constants";

function getThemeIcon(slug: string): string {
  return QUESTION_THEME_SLUG_ICON_MAP[slug] ?? QUESTION_THEME_UNKNOWN_ICON;
}

export { getThemeIcon };