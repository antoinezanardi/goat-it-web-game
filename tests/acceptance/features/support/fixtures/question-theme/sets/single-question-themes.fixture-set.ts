import { ObjectId } from "mongodb";

const SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY = {
  _id: new ObjectId("80f1a2b3c4d5e6f7a8b9c0d1"),
  slug: "geography",
  color: "#33A1FF",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  label: {
    en: "Geography",
  },
  aliases: {
    en: ["Geo"],
  },
  description: {
    en: "Theme about geography, countries and cities.",
  },
  status: "active",
};

const SINGLE_QUESTION_THEMES_FIXTURE_SET = [SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY] as const;

export {
  SINGLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  SINGLE_QUESTION_THEMES_FIXTURE_SET,
};