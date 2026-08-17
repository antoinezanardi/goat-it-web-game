import { ObjectId } from "mongodb";

const MULTIPLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY = {
  _id: new ObjectId("60a1b2c3d4e5f6a7b8c9d0e2"),
  slug: "geography",
  color: "#33A1FF",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  label: {
    en: "Geography",
    fr: "Géographie",
    it: "Geografia",
    pt: "Geografia",
    es: "Geografía",
    de: "Geografie",
  },
  aliases: {
    en: ["Geo"],
    fr: ["Géo"],
    it: ["Geo"],
    pt: ["Geo"],
    es: ["Geo"],
    de: ["Geo"],
  },
  description: {
    en: "Theme about geography, countries and cities.",
    fr: "Thème sur la géographie, les pays et les villes.",
    it: "Argomento sulla geografia, paesi e città.",
    pt: "Tema sobre geografia, países e cidades.",
    es: "Tema sobre geografía, países y ciudades.",
    de: "Thema über Geografie, Länder und Städte.",
  },
  status: "active",
};

const MULTIPLE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY = {
  _id: new ObjectId("70b2c3d4e5f6a7b8c9d0e1f2"),
  slug: "history",
  color: "#FF5733",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  label: {
    en: "History",
    fr: "Histoire",
    it: "Storia",
    pt: "História",
    es: "Historia",
    de: "Geschichte",
  },
  aliases: {
    en: ["Past"],
    fr: ["Passé"],
    it: ["Passato"],
    pt: ["Passado"],
    es: ["Pasado"],
    de: ["Vergangenheit"],
  },
  description: {
    en: "Theme about historical events, figures and periods.",
    fr: "Thème sur les événements historiques, personnages et périodes.",
    it: "Tema sugli eventi storici, personaggi e periodi.",
    pt: "Tema sobre eventos históricos, personagens e períodos.",
    es: "Tema sobre eventos históricos, figuras y períodos.",
    de: "Thema über historische Ereignisse, Persönlichkeiten und Epochen.",
  },
  status: "active",
};

const MULTIPLE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY = {
  _id: new ObjectId("80c3d4e5f6a7b8c9d0e1f2a3"),
  slug: "science",
  color: "#00C853",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  label: {
    en: "Science",
    fr: "Science",
    it: "Scienza",
    pt: "Ciência",
    es: "Ciencia",
    de: "Wissenschaft",
  },
  aliases: {
    en: ["Research"],
    fr: ["Recherche"],
    it: ["Ricerca"],
    pt: ["Pesquisa"],
    es: ["Investigación"],
    de: ["Forschung"],
  },
  description: {
    en: "Theme covering sciences, discoveries and innovations.",
    fr: "Thème couvrant les sciences, découvertes et innovations.",
    it: "Argomento che copre scienze, scoperte e innovazioni.",
    pt: "Tema que abrange ciências, descobertas e inovações.",
    es: "Tema que abarca ciencias, descubrimientos e innovaciones.",
    de: "Thema, das Wissenschaften, Entdeckungen und Innovationen abdeckt.",
  },
  status: "active",
};

const MULTIPLE_QUESTION_THEMES_FIXTURE_SET = [
  MULTIPLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
] as const;

export {
  MULTIPLE_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  MULTIPLE_QUESTION_THEMES_FIXTURE_SET,
};