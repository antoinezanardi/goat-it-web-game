import { LOCALES } from "@goat-it/schemas/shared/locale";
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

const collections = Object.fromEntries(LOCALES.flatMap(locale => [
  [
    `content_${locale}`,
    defineCollection({
      source: {
        include: `${locale}/**`,
        exclude: [`${locale}/changelog/**`],
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
  ],
  [
    `changelog_${locale}`,
    defineCollection({
      source: {
        include: `${locale}/changelog/**`,
        prefix: "",
      },
      schema: changelogSchema,
      type: "page",
    }),
  ],
]));

export default defineContentConfig({
  collections,
});