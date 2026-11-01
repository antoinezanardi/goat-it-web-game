import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";
import { describe, expect, it } from "vitest";

import { getDifficultyColor, getDifficultyIcon, getDifficultyIconColor, getDifficultyRingClass } from "@/utils/ui/question/helpers/cognitive-difficulty-display/question-cognitive-difficulty-display.helpers";

describe(getDifficultyColor, () => {
  it.each<{ difficulty: QuestionCognitiveDifficulty; color: string }>([
    { difficulty: "easy", color: "success" },
    { difficulty: "medium", color: "warning" },
    { difficulty: "hard", color: "error" },
  ])("should return the $color color when difficulty is $difficulty.", ({ difficulty, color }) => {
    expect(getDifficultyColor(difficulty)).toBe(color);
  });
});

describe(getDifficultyIconColor, () => {
  it.each<{ difficulty: QuestionCognitiveDifficulty; color: string }>([
    { difficulty: "easy", color: "#22C55E" },
    { difficulty: "medium", color: "#F59E0B" },
    { difficulty: "hard", color: "#EF4444" },
  ])("should return the $color color when difficulty is $difficulty.", ({ difficulty, color }) => {
    expect(getDifficultyIconColor(difficulty)).toBe(color);
  });
});

describe(getDifficultyIcon, () => {
  it.each<{ difficulty: QuestionCognitiveDifficulty; icon: string }>([
    { difficulty: "easy", icon: "i-lucide-brain" },
    { difficulty: "medium", icon: "i-lucide-brain-cog" },
    { difficulty: "hard", icon: "i-lucide-brain-circuit" },
  ])("should return the $icon icon when difficulty is $difficulty.", ({ difficulty, icon }) => {
    expect(getDifficultyIcon(difficulty)).toBe(icon);
  });
});

describe(getDifficultyRingClass, () => {
  it.each<{ difficulty: QuestionCognitiveDifficulty; ringClass: string }>([
    { difficulty: "easy", ringClass: "ring-success/50" },
    { difficulty: "medium", ringClass: "ring-warning/50" },
    { difficulty: "hard", ringClass: "ring-error/50" },
  ])("should return the $ringClass ring class when difficulty is $difficulty.", ({ difficulty, ringClass }) => {
    expect(getDifficultyRingClass(difficulty)).toBe(ringClass);
  });
});