import { describe, expect, it } from "vitest";

import { isQuestionCategory } from "#shared/utils/helpers/question/categories/question-categories.helpers";

describe(isQuestionCategory, () => {
  it.each<{ value: string; expected: boolean }>([
    { value: "trivia", expected: true },
    { value: "lexicon", expected: true },
    { value: "riddle", expected: true },
    { value: "explanation", expected: true },
    { value: "unknown", expected: false },
    { value: "", expected: false },
  ])("should return $expected when the value is $value.", ({ value, expected }) => {
    expect(isQuestionCategory(value)).toBe(expected);
  });
});