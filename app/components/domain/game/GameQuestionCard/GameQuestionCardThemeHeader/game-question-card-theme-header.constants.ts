import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

const DIFFICULTY_ICON = "i-lucide-brain-cog";

const DIFFICULTY_COLOR_MAP: Record<QuestionCognitiveDifficulty, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

export { DIFFICULTY_COLOR_MAP, DIFFICULTY_ICON };