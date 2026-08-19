import { ObjectId } from "mongodb";

import { FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY } from "#acceptance/features/support/fixtures/question-theme/sets/five-question-themes.fixture-set.ts";

const SINGLE_MULTI_THEMES_QUESTION_FIXTURE_SET = [
  {
    _id: new ObjectId("90d4e5f6a7b8c9d0e1f2a3b4"),
    category: "explanation",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    themes: [
      {
        themeId: FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: true,
        isPrimary: true,
      },
      {
        themeId: FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
      {
        themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "This question spans history, science, and cinema.",
      },
      answer: {
        en: "Multi-theme answer",
      },
      context: {
        en: "The question intentionally references multiple themes.",
      },
      trivia: {
        en: ["Theme stacking makes the card more informative."],
      },
    },
    cognitiveDifficulty: "medium",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Theme_(computer_graphics)"],
    status: "active",
  },
] as const;

export {
  SINGLE_MULTI_THEMES_QUESTION_FIXTURE_SET,
};