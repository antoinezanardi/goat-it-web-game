import { describe, expect, it } from "vitest";
import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { getCategoryIcon, getDifficultyColor, getDifficultyIcon, getDifficultyRingClass, getPrimaryTheme, getSecondaryThemes, getSourceDomain, hasSecondaryThemes, isPrimaryThemeHint } from "~/composables/domain/question/helpers/question.helpers";

describe(getSourceDomain, () => {
  it("should extract the hostname when a full HTTPS URL is provided.", () => {
    expect(getSourceDomain("https://en.wikipedia.org/wiki/Goat")).toBe("en.wikipedia.org");
  });

  it("should strip the www. prefix when the URL starts with www.", () => {
    expect(getSourceDomain("https://www.britannica.com/topic/goat")).toBe("britannica.com");
  });

  it("should return the raw input when the URL is malformed.", () => {
    expect(getSourceDomain("not a url")).toBe("not a url");
  });
});

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

describe(getDifficultyColor, () => {
  it.each<{ difficulty: QuestionCognitiveDifficulty; color: string }>([
    { difficulty: "easy", color: "success" },
    { difficulty: "medium", color: "warning" },
    { difficulty: "hard", color: "error" },
  ])("should return the $color color when difficulty is $difficulty.", ({ difficulty, color }) => {
    expect(getDifficultyColor(difficulty)).toBe(color);
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