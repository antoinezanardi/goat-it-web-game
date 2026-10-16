import { ObjectId } from "mongodb";

import { SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY } from "../../question-theme/sets/single-question-themes.fixture-set.ts";

const COGNITIVE_DIFFICULTY_QUESTIONS_FIXTURE_SET = [
  {
    _id: new ObjectId("c1a2b3c4d5e6f70123456781"),
    category: "trivia",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
    themes: [
      {
        themeId: SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which planet is known as the Red Planet?",
      },
      answer: {
        en: "Mars",
      },
    },
    cognitiveDifficulty: "easy",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Mars"],
    status: "active",
    isAdultContent: false,
  },
  {
    _id: new ObjectId("c1a2b3c4d5e6f70123456782"),
    category: "trivia",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
    themes: [
      {
        themeId: SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the largest ocean on Earth?",
      },
      answer: {
        en: "The Pacific Ocean",
      },
    },
    cognitiveDifficulty: "hard",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Pacific_Ocean"],
    status: "active",
    isAdultContent: false,
  },
  {
    _id: new ObjectId("c1a2b3c4d5e6f70123456783"),
    category: "trivia",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
    themes: [
      {
        themeId: SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Who painted the Mona Lisa?",
      },
      answer: {
        en: "Leonardo da Vinci",
      },
    },
    cognitiveDifficulty: "hard",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Mona_Lisa"],
    status: "active",
    isAdultContent: false,
  },
] as const;

export {
  COGNITIVE_DIFFICULTY_QUESTIONS_FIXTURE_SET,
};