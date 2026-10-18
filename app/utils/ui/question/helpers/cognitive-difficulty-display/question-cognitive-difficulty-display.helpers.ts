import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import { DIFFICULTY_COLOR_MAP, DIFFICULTY_ICON_COLOR_MAP, DIFFICULTY_ICON_MAP, DIFFICULTY_RING_CLASS_MAP } from "@/utils/ui/question/helpers/cognitive-difficulty-display/question-cognitive-difficulty-display.constants";

function getDifficultyColor(difficulty: QuestionCognitiveDifficulty): "success" | "warning" | "error" {
  return DIFFICULTY_COLOR_MAP[difficulty];
}

function getDifficultyIconColor(difficulty: QuestionCognitiveDifficulty): string {
  return DIFFICULTY_ICON_COLOR_MAP[difficulty];
}

function getDifficultyIcon(difficulty: QuestionCognitiveDifficulty): string {
  return DIFFICULTY_ICON_MAP[difficulty];
}

function getDifficultyRingClass(difficulty: QuestionCognitiveDifficulty): string {
  return DIFFICULTY_RING_CLASS_MAP[difficulty];
}

export {
  getDifficultyColor,
  getDifficultyIcon,
  getDifficultyIconColor,
  getDifficultyRingClass,
};