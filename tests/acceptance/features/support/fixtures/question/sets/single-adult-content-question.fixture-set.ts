import { ObjectId } from "mongodb";

import { FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY } from "#acceptance/features/support/fixtures/question-theme/sets/five-question-themes.fixture-set.ts";

const SINGLE_ADULT_CONTENT_QUESTION_FIXTURE_SET = [
  {
    _id: new ObjectId("90f6a7b8c9d0e1f2a3b4c5d6"),
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
        en: "Which 1960 Alfred Hitchcock film is famous for its shocking shower scene?",
      },
      answer: {
        en: "Psycho",
      },
      context: {
        en: "Released in 1960, 'Psycho' is a psychological horror film whose shower scene became one of the most iconic moments in cinema history.",
      },
    },
    cognitiveDifficulty: "medium",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Psycho_(1960_film)"],
    status: "active",
    isAdultContent: true,
  },
] as const;

export {
  SINGLE_ADULT_CONTENT_QUESTION_FIXTURE_SET,
};