import type { QuestionCategory } from "@goat-it/schemas/question";

const QUESTION_CATEGORY_ICON_MAP: Record<QuestionCategory, string> = {
  trivia: "i-lucide-sparkle",
  lexicon: "i-lucide-languages",
  riddle: "i-lucide-puzzle",
  explanation: "i-lucide-atom",
};

export { QUESTION_CATEGORY_ICON_MAP };