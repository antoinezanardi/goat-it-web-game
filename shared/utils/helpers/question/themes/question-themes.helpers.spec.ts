import { describe, expect, it } from "vitest";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { getPrimaryTheme, getSecondaryThemes, hasSecondaryThemes, isPrimaryThemeHint } from "#shared/utils/helpers/question/themes/question-themes.helpers";

describe(getPrimaryTheme, () => {
  it("should return the theme when the assignment is flagged as primary.", () => {
    const primaryTheme = createFakeQuestionTheme();
    const otherTheme = createFakeQuestionTheme();
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: otherTheme }),
        createFakeQuestionThemeAssignment({ isPrimary: true, theme: primaryTheme }),
      ],
    });

    expect(getPrimaryTheme(question)).toBe(primaryTheme);
  });

  it("should return undefined when none is flagged as primary.", () => {
    const firstTheme = createFakeQuestionTheme();
    const secondTheme = createFakeQuestionTheme();
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: firstTheme }),
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondTheme }),
      ],
    });

    expect(getPrimaryTheme(question)).toBeUndefined();
  });
});

describe(getSecondaryThemes, () => {
  it("should return an empty array when the question has no secondary themes.", () => {
    const question = createFakeQuestion({
      themes: [createFakeQuestionThemeAssignment({ isPrimary: true })],
    });

    expect(getSecondaryThemes(question)).toStrictEqual([]);
  });

  it("should return an empty array when the question has no themes.", () => {
    const question = createFakeQuestion({ themes: [] });

    expect(getSecondaryThemes(question)).toStrictEqual([]);
  });

  it("should return the secondary theme when the question has exactly one.", () => {
    const secondaryTheme = createFakeQuestionTheme({ label: "Secondary Theme" });
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: true }),
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondaryTheme }),
      ],
    });

    expect(getSecondaryThemes(question)).toStrictEqual([secondaryTheme]);
  });

  it("should return all secondary themes in their original order when the question has multiple secondary themes.", () => {
    const firstSecondary = createFakeQuestionTheme({ label: "First Secondary" });
    const secondSecondary = createFakeQuestionTheme({ label: "Second Secondary" });
    const otherPrimary = createFakeQuestionTheme({ label: "Other Primary" });
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: true }),
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: firstSecondary }),
        createFakeQuestionThemeAssignment({ isPrimary: true, theme: otherPrimary }),
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondSecondary }),
      ],
    });

    expect(getSecondaryThemes(question)).toStrictEqual([firstSecondary, secondSecondary]);
  });
});

describe(hasSecondaryThemes, () => {
  it("should return false when the question has no secondary themes.", () => {
    const question = createFakeQuestion({
      themes: [createFakeQuestionThemeAssignment({ isPrimary: true })],
    });

    expect(hasSecondaryThemes(question)).toBe(false);
  });

  it("should return false when the question has no themes.", () => {
    const question = createFakeQuestion({ themes: [] });

    expect(hasSecondaryThemes(question)).toBe(false);
  });

  it("should return true when the question has at least one secondary theme.", () => {
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: true }),
        createFakeQuestionThemeAssignment({ isPrimary: false }),
      ],
    });

    expect(hasSecondaryThemes(question)).toBe(true);
  });
});

describe(isPrimaryThemeHint, () => {
  it.each<{ isPrimary: boolean; isHint: boolean; expected: boolean }>([
    { isPrimary: true, isHint: true, expected: true },
    { isPrimary: true, isHint: false, expected: false },
    { isPrimary: false, isHint: true, expected: false },
    { isPrimary: false, isHint: false, expected: false },
  ])("should return $expected when primary is $isPrimary and hint is $isHint.", ({ isPrimary, isHint, expected }) => {
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary, isHint }),
        createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false }),
      ],
    });

    expect(isPrimaryThemeHint(question)).toBe(expected);
  });
});