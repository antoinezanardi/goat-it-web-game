import { QUESTION_CATEGORIES } from "@goat-it/schemas/question";
import type { QuestionCategory } from "@goat-it/schemas/question";

function isQuestionCategory(value: string): value is QuestionCategory {
  return QUESTION_CATEGORIES.some(category => category === value);
}

export { isQuestionCategory };