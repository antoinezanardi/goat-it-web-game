import { QUESTION_CATEGORIES } from "@goat-it/schemas/question";
import type { QuestionCategory } from "@goat-it/schemas/question";

/**
 * Returns whether the value is one of the supported question categories.
 */
function isQuestionCategory(value: string): value is QuestionCategory {
  return QUESTION_CATEGORIES.some(category => category === value);
}

export { isQuestionCategory };