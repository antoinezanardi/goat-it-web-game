import type { QuestionCategory } from "@goat-it/schemas/question";
import { describe, expect, it } from "vitest";

import { getCategoryColor, getCategoryIcon } from "@/utils/ui/question/helpers/category-display/question-category-display.helpers";

describe(getCategoryIcon, () => {
  it.each<{ category: QuestionCategory; icon: string }>([
    { category: "trivia", icon: "i-lucide-sparkle" },
    { category: "lexicon", icon: "i-lucide-languages" },
    { category: "riddle", icon: "i-lucide-puzzle" },
    { category: "explanation", icon: "i-lucide-atom" },
  ])("should return the $icon icon when category is $category.", ({ category, icon }) => {
    expect(getCategoryIcon(category)).toBe(icon);
  });
});

describe(getCategoryColor, () => {
  it.each<{ category: QuestionCategory; color: string }>([
    { category: "trivia", color: "#F59E0B" },
    { category: "lexicon", color: "#3B82F6" },
    { category: "riddle", color: "#A855F7" },
    { category: "explanation", color: "#10B981" },
  ])("should return the $color color when category is $category.", ({ category, color }) => {
    expect(getCategoryColor(category)).toBe(color);
  });
});