import { describe, expect, it } from "vitest";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionContent } from "~~/tests/unit/utils/faketories/question/question-content.entity.faketory";

import { getNonEmptyTrivia, hasContextAndTriviaSection, hasNonEmptyContext } from "#shared/utils/helpers/question/context/question-context.helpers";

describe(hasNonEmptyContext, () => {
  it.each<{ context?: string; expected: boolean }>([
    { context: undefined, expected: false },
    { context: "", expected: false },
    { context: "   ", expected: false },
    { context: "  Some context.  ", expected: true },
  ])("should return $expected when context is $context.", ({ context, expected }) => {
    expect(hasNonEmptyContext(context)).toBe(expected);
  });
});

describe(getNonEmptyTrivia, () => {
  it.each<{ trivia?: string[]; expected: string[] }>([
    { trivia: undefined, expected: [] },
    { trivia: [], expected: [] },
    { trivia: ["", "   "], expected: [] },
    { trivia: ["  Fact one  ", "", "   "], expected: ["  Fact one  "] },
  ])("should return $expected when trivia is $trivia.", ({ trivia, expected }) => {
    expect(getNonEmptyTrivia(trivia)).toStrictEqual(expected);
  });
});

describe(hasContextAndTriviaSection, () => {
  it.each<{ context?: string; trivia?: string[]; expected: boolean }>([
    { context: undefined, trivia: undefined, expected: false },
    { context: "   ", trivia: ["", "  "], expected: false },
    { context: "Some context.", trivia: undefined, expected: true },
    { context: "   ", trivia: ["Fact one"], expected: true },
    { context: "Some context.", trivia: ["Fact one"], expected: true },
  ])("should return $expected when context is $context and trivia is $trivia.", ({ context, trivia, expected }) => {
    const question = createFakeQuestion({ content: createFakeQuestionContent({ context, trivia }) });

    expect(hasContextAndTriviaSection(question)).toBe(expected);
  });
});