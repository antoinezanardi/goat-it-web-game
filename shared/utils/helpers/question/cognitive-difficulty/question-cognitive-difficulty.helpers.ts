import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

/**
 * Returns whether the value is one of the supported question cognitive difficulties.
 */
function isQuestionCognitiveDifficulty(value: string): value is QuestionCognitiveDifficulty {
  return QUESTION_COGNITIVE_DIFFICULTIES.some(difficulty => difficulty === value);
}

export { isQuestionCognitiveDifficulty };