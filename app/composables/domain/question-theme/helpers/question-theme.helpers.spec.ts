import { describe, expect, it } from "vitest";

import { QUESTION_THEME_UNKNOWN_ICON } from "~/composables/domain/question-theme/constants/question-theme.constants";
import { getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

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
    it.each([
      ["a valid #rrggbb color", "#B8860B", "#B8860B"],
      ["a short #rgb color", "#F00", "#A1A1AA"],
      ["an invalid string", "not-a-color", "#A1A1AA"],
      ["undefined", undefined, "#A1A1AA"],
    ])("should return the correct value when %s is provided.", (_title, input, expected) => {
      expect(resolveThemeColor(input)).toBe(expected);
    });
  });
});