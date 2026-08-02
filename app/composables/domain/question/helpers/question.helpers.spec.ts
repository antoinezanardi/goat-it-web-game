import { describe, expect, it } from "vitest";
import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { getCategoryIcon, getDifficultyColor, getPrimaryTheme, getSourceDomain } from "~/composables/domain/question/helpers/question.helpers";

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