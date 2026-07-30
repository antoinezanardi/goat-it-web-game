import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

const QUESTION_CATEGORY_ICON_MAP: Record<QuestionCategory, string> = {
  trivia: "i-lucide-sparkle",
  lexicon: "i-lucide-languages",
  riddle: "i-lucide-puzzle",
  explanation: "i-lucide-atom",
};

const DIFFICULTY_ICON = "i-lucide-brain-cog";

const DIFFICULTY_COLOR_MAP: Record<QuestionCognitiveDifficulty, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

export { DIFFICULTY_COLOR_MAP, DIFFICULTY_ICON, QUESTION_CATEGORY_ICON_MAP };