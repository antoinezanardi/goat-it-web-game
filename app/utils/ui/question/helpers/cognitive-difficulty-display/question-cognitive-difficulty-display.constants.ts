import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

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

const DIFFICULTY_RING_CLASS_MAP: Record<QuestionCognitiveDifficulty, string> = {
  easy: "ring-success/50",
  medium: "ring-warning/50",
  hard: "ring-error/50",
};

const DIFFICULTY_ICON_COLOR_MAP: Record<QuestionCognitiveDifficulty, string> = {
  easy: "#22C55E",
  medium: "#F59E0B",
  hard: "#EF4444",
};

export {
  DIFFICULTY_COLOR_MAP,
  DIFFICULTY_ICON_COLOR_MAP,
  DIFFICULTY_ICON_MAP,
  DIFFICULTY_RING_CLASS_MAP,
};