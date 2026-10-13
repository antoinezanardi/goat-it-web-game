import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const rulesSchema = z.object({
  description: z.string(),
  title: z.string(),
});

const changelogSchema = z.object({
  version: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
});

export default defineContentConfig({
  collections: {
    content_fr: defineCollection({
      source: {
        include: "fr/**",
        exclude: ["fr/changelog/**"],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_en: defineCollection({
      source: {
        include: "en/**",
        exclude: ["en/changelog/**"],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_de: defineCollection({
      source: {
        include: "de/**",
        exclude: ["de/changelog/**"],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_es: defineCollection({
      source: {
        include: "es/**",
        exclude: ["es/changelog/**"],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_it: defineCollection({
      source: {
        include: "it/**",
        exclude: ["it/changelog/**"],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_pt: defineCollection({
      source: {
        include: "pt/**",
        exclude: ["pt/changelog/**"],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    changelog_fr: defineCollection({
      source: {
        include: "fr/changelog/**",
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
    changelog_en: defineCollection({
      source: {
        include: "en/changelog/**",
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
    changelog_de: defineCollection({
      source: {
        include: "de/changelog/**",
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
    changelog_es: defineCollection({
      source: {
        include: "es/changelog/**",
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
    changelog_it: defineCollection({
      source: {
        include: "it/changelog/**",
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
    changelog_pt: defineCollection({
      source: {
        include: "pt/changelog/**",
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
  },
});