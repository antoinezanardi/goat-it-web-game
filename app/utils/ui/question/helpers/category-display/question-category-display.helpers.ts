import type { QuestionCategory } from "@goat-it/schemas/question";

import { QUESTION_CATEGORY_COLOR_MAP, QUESTION_CATEGORY_ICON_MAP } from "@/utils/ui/question/helpers/category-display/question-category-display.constants";

function getCategoryIcon(category: QuestionCategory): string {
  return QUESTION_CATEGORY_ICON_MAP[category];
}

function getCategoryColor(category: QuestionCategory): string {
  return QUESTION_CATEGORY_COLOR_MAP[category];
}

export {
  getCategoryColor,
  getCategoryIcon,
};