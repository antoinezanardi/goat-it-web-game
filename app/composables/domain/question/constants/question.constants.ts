import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

const QUESTION_CATEGORY_ICON_MAP: Record<QuestionCategory, string> = {
  trivia: "i-lucide-sparkle",
  lexicon: "i-lucide-languages",
  riddle: "i-lucide-puzzle",
  explanation: "i-lucide-atom",
};

const DIFFICULTY_COLOR_MAP: Record<QuestionCognitiveDifficulty, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

const DIFFICULTY_ICON_MAP: Record<QuestionCognitiveDifficulty, string> = {
  easy: "i-lucide-brain",
  medium: "i-lucide-brain-cog",
  hard: "i-lucide-brain-circuit",
};

const QUESTION_HINT_ICON = "i-lucide-mouth-off";
const QUESTION_PRIMARY_ICON = "i-lucide-star";
const QUESTION_ADULT_CONTENT_ICON = "i-lucide-venetian-mask";

const DIFFICULTY_RING_CLASS_MAP: Record<QuestionCognitiveDifficulty, string> = {
  easy: "ring-success/50",
  medium: "ring-warning/50",
  hard: "ring-error/50",
};

export { DIFFICULTY_COLOR_MAP, DIFFICULTY_ICON_MAP, DIFFICULTY_RING_CLASS_MAP, QUESTION_ADULT_CONTENT_ICON, QUESTION_CATEGORY_ICON_MAP, QUESTION_HINT_ICON, QUESTION_PRIMARY_ICON };