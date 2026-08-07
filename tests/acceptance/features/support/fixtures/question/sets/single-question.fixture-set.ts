import { ObjectId } from "mongodb";

import { SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY } from "../../question-theme/sets/single-question-themes.fixture-set.ts";

const SINGLE_QUESTION_FIXTURE_SET = [
  {
    _id: new ObjectId("90a1b2c3d4e5f6a7b8c9d0e1"),
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
        en: "What is the capital of France?",
      },
      answer: {
        en: "Paris",
      },
      context: {
        en: "Paris has been the capital of France since the 10th century.",
      },
      trivia: {
        en: [
          "Paris is known as the City of Light",
          "The Eiffel Tower was built in 1889",
        ],
      },
    },
    cognitiveDifficulty: "easy",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: [
      "https://en.wikipedia.org/wiki/Paris",
      "https://www.britannica.com/place/Paris",
    ],
    status: "active",
  },
] as const;

export {
  SINGLE_QUESTION_FIXTURE_SET,
};