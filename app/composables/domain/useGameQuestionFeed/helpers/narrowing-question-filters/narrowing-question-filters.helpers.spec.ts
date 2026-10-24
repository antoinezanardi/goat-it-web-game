import { describe, expect, it } from "vitest";

import { hasNarrowingQuestionFilters } from "@/composables/domain/useGameQuestionFeed/helpers/narrowing-question-filters/narrowing-question-filters.helpers";

describe(hasNarrowingQuestionFilters, () => {
  it.each<{ case: string; filters: Parameters<typeof hasNarrowingQuestionFilters>[0]; expected: boolean }>([
    { case: "no narrowing keys are present", filters: {}, expected: false },
    { case: "only the adult content flag is present", filters: { isAdultContent: false }, expected: false },
    { case: "categories are narrowed", filters: { categories: ["trivia"] }, expected: true },
    { case: "cognitive difficulties are narrowed", filters: { cognitiveDifficulties: ["easy"] }, expected: true },
    { case: "theme ids are narrowed", filters: { themeIds: ["theme-a"] }, expected: true },
  ])("should return $expected when $case.", ({ filters, expected }) => {
    expect(hasNarrowingQuestionFilters(filters)).toBe(expected);
  });
});