import type { Question } from "#shared/types/question.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR, QUESTION_THEME_SLUG_ICON_MAP, QUESTION_THEME_UNKNOWN_ICON } from "~/composables/domain/question-theme/constants/question-theme.constants";

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/u;

function getThemeIcon(slug: string): string {
  return QUESTION_THEME_SLUG_ICON_MAP[slug] ?? QUESTION_THEME_UNKNOWN_ICON;
}

function resolveThemeColor(color?: string): string {
  if (color === undefined) {
    console.error("resolveThemeColor: received undefined color, falling back to neutral grey.");

    return NEUTRAL_GREY_FALLBACK_THEME_COLOR;
  }

  if (HEX_COLOR_PATTERN.test(color)) {
    return color;
  }

  console.error(`resolveThemeColor: invalid color "${color}", falling back to neutral grey.`);

  return NEUTRAL_GREY_FALLBACK_THEME_COLOR;
}

function getPrimaryTheme(question: Question): QuestionTheme {
  const primary = question.themes.find(t => t.isPrimary)?.theme;

  if (primary !== undefined) {
    return primary;
  }
  // Acceptable as themes array is guaranteed non-empty by Question domain invariant
  // oxlint-disable-next-line typescript/no-non-null-assertion
  return question.themes[0]!.theme;
}

export { getPrimaryTheme, getThemeIcon, resolveThemeColor };