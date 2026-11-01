import { describe, expect, it } from "vitest";

import { isQuestionCognitiveDifficulty } from "#shared/utils/helpers/question/cognitive-difficulty/question-cognitive-difficulty.helpers";

describe(isQuestionCognitiveDifficulty, () => {
  it.each<{ value: string; expected: boolean }>([
    { value: "easy", expected: true },
    { value: "medium", expected: true },
    { value: "hard", expected: true },
    { value: "insane", expected: false },
    { value: "", expected: false },
  ])("should return $expected when the value is $value.", ({ value, expected }) => {
    expect(isQuestionCognitiveDifficulty(value)).toBe(expected);
  });
});