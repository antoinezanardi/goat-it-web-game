import { ObjectId } from "mongodb";

import { FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY } from "../../question-theme/sets/five-question-themes.fixture-set.ts";

const SINGLE_TRANSLATABLE_QUESTION_FIXTURE_ID = "60af924f4f1a2563f8e8b456";

const SINGLE_TRANSLATABLE_QUESTION_FIXTURE_SET = [
  {
    _id: new ObjectId(SINGLE_TRANSLATABLE_QUESTION_FIXTURE_ID),
    category: "trivia",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    themes: [
      {
        themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the capital of France?",
        fr: "Quelle est la capitale de la France ?",
      },
      answer: {
        en: "Paris",
        fr: "Paris",
      },
      context: {
        en: "Paris has been the capital of France since the 10th century.",
        fr: "Paris est la capitale de la France depuis le Xe siècle.",
      },
      trivia: {
        en: [
          "Paris is known as the City of Light",
          "The Eiffel Tower was built in 1889",
        ],
        fr: [
          "Paris est surnommée la Ville Lumière",
          "La tour Eiffel a été construite en 1889",
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
  SINGLE_TRANSLATABLE_QUESTION_FIXTURE_ID,
  SINGLE_TRANSLATABLE_QUESTION_FIXTURE_SET,
};