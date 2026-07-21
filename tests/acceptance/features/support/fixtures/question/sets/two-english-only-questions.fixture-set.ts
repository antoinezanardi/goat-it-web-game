import { ObjectId } from "mongodb";

import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY, TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY } from "../../question-theme/sets/two-english-only-question-themes.fixture-set.ts";

const TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET = [
  {
    _id: new ObjectId("aa11bb22cc33dd44ee55ff01"),
    category: "riddle",
    createdAt: new Date("2024-02-01T00:00:00.000Z"),
    updatedAt: new Date("2024-02-01T00:00:00.000Z"),
    themes: [
      {
        themeId: TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which famous director made the film 'Vertigo' (1958)?",
      },
      answer: {
        en: "Alfred Hitchcock",
      },
      context: {
        en: "'Vertigo' is a 1958 film directed by Alfred Hitchcock and is widely regarded as one of his masterpieces.",
      },
      trivia: {
        en: ["The film's exploration of obsession and identity has made it a subject of much critical analysis."],
      },
    },
    cognitiveDifficulty: "medium",
    author: {
      role: "admin",
      name: "Test Author",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Vertigo_(film)"],
    status: "active",
  },
  {
    _id: new ObjectId("bb22cc33dd44ee55ff660102"),
    category: "trivia",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    themes: [
      {
        themeId: TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which English rock band released the album 'The Dark Side of the Moon'?",
      },
      answer: {
        en: "Pink Floyd",
      },
      context: {
        en: "'The Dark Side of the Moon' is a 1973 album by Pink Floyd, notable for its sonic experimentation.",
      },
      trivia: {
        en: ["The album spent a record number of weeks on the Billboard charts."],
      },
    },
    cognitiveDifficulty: "hard",
    author: {
      role: "ai",
      name: "Music AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon"],
    status: "pending",
  },
] as const;

export {
  TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET,
};