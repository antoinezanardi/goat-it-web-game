import { ObjectId } from "mongodb";

const FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY = {
  _id: new ObjectId("8ef21e4eb04eb0fa5a469d87"),
  slug: "cinema",
  color: "#33A1FF",
  label: {
    fr: "Cinéma",
    en: "Cinema",
    it: "Cinema",
    pt: "Cinema",
    es: "Cine",
    de: "Kino",
  },
  aliases: {
    fr: ["Films", "Ciné"],
    en: ["Movies", "Films"],
    it: ["Film", "Pellicole"],
    pt: ["Filmes", "Cinema"],
    es: ["Películas", "Cine"],
    de: ["Filme", "Kino"],
  },
  description: {
    fr: "Thème concernant le cinéma et les films.",
    en: "Theme about cinema and movies.",
    it: "Argomento sul cinema e i film.",
    pt: "Tema sobre o cinema e filmes.",
    es: "Tema sobre cine y películas.",
    de: "Thema über Kino und Filme.",
  },
  status: "active",
  createdAt: new Date("2024-05-01T00:00:00.000Z"),
  updatedAt: new Date("2024-05-01T00:00:00.000Z"),
};

const FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY = {
  _id: new ObjectId("ddb03d94cae8df38d28e5adc"),
  slug: "music",
  color: "#FA2333",
  label: {
    fr: "Musique",
    en: "Music",
    it: "Musica",
    pt: "Música",
    es: "Música",
    de: "Musik",
  },
  aliases: {
    fr: ["Chanson", "Son"],
    en: ["Songs", "Tunes"],
    it: ["Canzoni", "Brani"],
    pt: ["Canções", "Músicas"],
    es: ["Canciones", "Melodías"],
    de: ["Lieder", "Melodien"],
  },
  description: {
    fr: "Thème lié à la musique, aux artistes et aux genres musicaux.",
    en: "Theme about music, artists and music genres.",
    it: "Argomento sulla musica, artisti e generi musicali.",
    pt: "Tema sobre música, artistas e gêneros musicais.",
    es: "Tema sobre música, artistas y géneros musicales.",
    de: "Thema über Musik, Künstler und Musikgenres.",
  },
  status: "active",
  createdAt: new Date("2024-04-01T00:00:00.000Z"),
  updatedAt: new Date("2024-04-01T00:00:00.000Z"),
};

const FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY = {
  _id: new ObjectId("dbb0664ad4797c6cc79d5aee"),
  slug: "sports",
  label: {
    fr: "Sport",
    en: "Sports",
    it: "Sport",
    pt: "Esportes",
    es: "Deportes",
    de: "Sport",
  },
  aliases: {
    fr: ["Football", "Jeux"],
    en: ["Football", "Games"],
    it: ["Calcio", "Giochi"],
    pt: ["Futebol", "Jogos"],
    es: ["Fútbol", "Juegos"],
    de: ["Fußball", "Spiele"],
  },
  description: {
    fr: "Thème concernant les sports, compétitions et athlètes.",
    en: "Theme about sports, competitions and athletes.",
    it: "Tema sullo sport, competizioni e atleti.",
    pt: "Tema sobre esportes, competições e atletas.",
    es: "Tema sobre deportes, competiciones y atletas.",
    de: "Thema über Sport, Wettbewerbe und Athleten.",
  },
  status: "archived",
  createdAt: new Date("2024-03-01T00:00:00.000Z"),
  updatedAt: new Date("2024-03-01T00:00:00.000Z"),
};

const FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY = {
  _id: new ObjectId("9adeceb41db80ab7ec49b457"),
  slug: "science",
  label: {
    fr: "Science",
    en: "Science",
    it: "Scienza",
    pt: "Ciência",
    es: "Ciencia",
    de: "Wissenschaft",
  },
  aliases: {
    fr: ["Technologie", "Recherche"],
    en: ["Technology", "Research"],
    it: ["Tecnologia", "Ricerca"],
    pt: ["Tecnologia", "Pesquisa"],
    es: ["Tecnología", "Investigación"],
    de: ["Technologie", "Forschung"],
  },
  description: {
    fr: "Thème couvrant les sciences, découvertes et innovations.",
    en: "Theme covering sciences, discoveries and innovations.",
    it: "Argomento che copre scienze, scoperte e innovazioni.",
    pt: "Tema que abrange ciências, descobertas e inovações.",
    es: "Tema que abarca ciencias, descubrimientos e innovaciones.",
    de: "Thema, das Wissenschaften, Entdeckungen und Innovationen abdeckt.",
  },
  status: "active",
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
  updatedAt: new Date("2024-02-01T00:00:00.000Z"),
};

const FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY = {
  _id: new ObjectId("cddb37b90e4f6b7ec27bc1ee"),
  slug: "history",
  color: "#FF5733",
  label: {
    fr: "Histoire",
    en: "History",
    it: "Storia",
    pt: "História",
    es: "Historia",
    de: "Geschichte",
  },
  aliases: {
    fr: ["Passé", "Chronologie"],
    en: ["Past", "Chronology"],
    it: ["Passato", "Cronologia"],
    pt: ["Passado", "Cronologia"],
    es: ["Pasado", "Cronología"],
    de: ["Vergangenheit", "Chronologie"],
  },
  description: {
    fr: "Thème sur les événements historiques, personnages et périodes.",
    en: "Theme about historical events, figures and periods.",
    it: "Tema sugli eventi storici, personaggi e periodi.",
    pt: "Tema sobre eventos históricos, personagens e períodos.",
    es: "Tema sobre eventos históricos, figuras y períodos.",
    de: "Thema über historische Ereignisse, Persönlichkeiten und Epochen.",
  },
  status: "active",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const FIVE_QUESTION_THEMES_FIXTURE_SET = [
  FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
] as const;

export {
  FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SET,
};