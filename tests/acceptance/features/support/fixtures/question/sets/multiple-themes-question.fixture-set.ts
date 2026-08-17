import { ObjectId } from "mongodb";

import {
  MULTIPLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
} from "../../question-theme/sets/multiple-question-themes.fixture-set.ts";

const MULTIPLE_THEMES_QUESTION_FIXTURE_SET = [
  {
    _id: new ObjectId("90d4e5f6a7b8c9d0e1f2a3b4"),
    category: "explanation",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    themes: [
      {
        themeId: MULTIPLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: MULTIPLE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
      {
        themeId: MULTIPLE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "This question spans geography, history, and science.",
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
  MULTIPLE_THEMES_QUESTION_FIXTURE_SET,
};