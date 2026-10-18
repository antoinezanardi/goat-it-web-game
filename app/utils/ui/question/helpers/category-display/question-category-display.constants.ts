import type { QuestionCategory } from "@goat-it/schemas/question";

const QUESTION_CATEGORY_ICON_MAP: Record<QuestionCategory, string> = {
  trivia: "i-lucide-sparkle",
  lexicon: "i-lucide-languages",
  riddle: "i-lucide-puzzle",
  explanation: "i-lucide-atom",
};

const QUESTION_CATEGORY_COLOR_MAP: Record<QuestionCategory, string> = {
  trivia: "#F59E0B",
  lexicon: "#3B82F6",
  riddle: "#A855F7",
  explanation: "#10B981",
};

export {
  QUESTION_CATEGORY_COLOR_MAP,
  QUESTION_CATEGORY_ICON_MAP,
};