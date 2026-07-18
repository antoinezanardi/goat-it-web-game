import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { QUESTION_THEME_UNKNOWN_ICON } from "~/composables/domain/question-theme/constants/question-theme.constants";
import { getPrimaryTheme, getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

describe("Question Theme Helpers", () => {
  describe(getThemeIcon, () => {
    it.each<{ slug: string; expectedIcon: string }>([
      { slug: "history-civilizations", expectedIcon: "i-lucide-landmark" },
      { slug: "geography-travels", expectedIcon: "i-lucide-globe" },
      { slug: "animals", expectedIcon: "i-lucide-paw-print" },
      { slug: "nature-environment", expectedIcon: "i-lucide-tree-pine" },
      { slug: "space-astronomy", expectedIcon: "i-lucide-rocket" },
      { slug: "society-daily-life", expectedIcon: "i-lucide-users" },
      { slug: "body-health", expectedIcon: "i-lucide-heart-pulse" },
      { slug: "gastronomy", expectedIcon: "i-lucide-chef-hat" },
      { slug: "miscellaneous-facts", expectedIcon: "i-lucide-newspaper" },
      { slug: "music", expectedIcon: "i-lucide-music" },
      { slug: "cinema-series", expectedIcon: "i-lucide-clapperboard" },
      { slug: "leisure-games", expectedIcon: "i-lucide-dice-5" },
      { slug: "sports-exploits", expectedIcon: "i-lucide-trophy" },
      { slug: "books-fine-arts", expectedIcon: "i-lucide-book-open" },
      { slug: "sciences-innovations", expectedIcon: "i-lucide-flask-conical" },
      { slug: "language-words", expectedIcon: "i-lucide-message-circle" },
      { slug: "beliefs-myths", expectedIcon: "i-lucide-sparkles" },
    ])("should return icon $expectedIcon when the slug is $slug.", ({ slug, expectedIcon }) => {
      expect(getThemeIcon(slug)).toBe(expectedIcon);
    });

    it("should return the unknown icon when the slug is not in the map.", () => {
      expect(getThemeIcon("unknown-slug")).toBe(QUESTION_THEME_UNKNOWN_ICON);
    });
  });

  describe(resolveThemeColor, () => {
    let consoleErrorSpy: Mock<typeof console.error>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        /* Empty */
      });
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("should return the same hex when a valid #rrggbb color is provided.", () => {
      expect(resolveThemeColor("#B8860B")).toBe("#B8860B");
    });

    it("should return the same hex when a valid #rgb color is provided.", () => {
      expect(resolveThemeColor("#F00")).toBe("#F00");
    });

    it("should return the neutral grey fallback when an invalid string is provided.", () => {
      expect(resolveThemeColor("not-a-color")).toBe("#A1A1AA");
    });

    it("should log an error when an invalid string is provided.", () => {
      resolveThemeColor("not-a-color");

      expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith("resolveThemeColor: invalid color \"not-a-color\", falling back to neutral grey.");
    });

    it("should return the neutral grey fallback when undefined is provided.", () => {
      expect(resolveThemeColor(undefined)).toBe("#A1A1AA");
    });

    it("should log an error when undefined is provided.", () => {
      resolveThemeColor(undefined);

      expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith("resolveThemeColor: received undefined color, falling back to neutral grey.");
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

    it("should fall back to the first assignment's theme when none is flagged as primary.", () => {
      const firstTheme = createFakeQuestionTheme();
      const secondTheme = createFakeQuestionTheme();
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({ isPrimary: false, theme: firstTheme }),
          createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondTheme }),
        ],
      });

      expect(getPrimaryTheme(question)).toBe(firstTheme);
    });
  });
});