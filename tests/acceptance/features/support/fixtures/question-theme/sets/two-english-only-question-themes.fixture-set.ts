import { ObjectId } from "mongodb";

const TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY = {
  _id: new ObjectId("5cd8edcc5fdf4cf6aaf79c9e"),
  slug: "cinema",
  color: "#33A1FF",
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
  updatedAt: new Date("2024-02-01T00:00:00.000Z"),
  label: {
    en: "Cinema",
  },
  aliases: {
    en: ["Movies", "Films"],
  },
  description: {
    en: "Theme about cinema and movies.",
  },
  status: "active",
};

const TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY = {
  _id: new ObjectId("3ff6c1e3ae2fe3fdd9ced1e8"),
  slug: "music",
  color: "#FA2333",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  label: {
    en: "Music",
  },
  aliases: {
    en: ["Songs", "Tunes"],
  },
  description: {
    en: "Theme about music, artists and music genres.",
  },
  status: "active",
};

const TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET = [
  TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
] as const;

export {
  TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET,
};