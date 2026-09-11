import { ObjectId } from "mongodb";

import { SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY } from "../../question-theme/sets/single-question-themes.fixture-set.ts";

const SINGLE_NO_CONTEXT_QUESTION_FIXTURE_SET = [
  {
    _id: new ObjectId("90a1b2c3d4e5f6a7b8c9d0e2"),
    category: "trivia",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    themes: [
      {
        themeId: SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the capital of Italy?",
      },
      answer: {
        en: "Rome",
      },
    },
    cognitiveDifficulty: "easy",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Rome"],
    status: "active",
  },
] as const;

export {
  SINGLE_NO_CONTEXT_QUESTION_FIXTURE_SET,
};