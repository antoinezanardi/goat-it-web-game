import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const rulesSchema = z.object({
  description: z.string(),
  title: z.string(),
});

export default defineContentConfig({
  collections: {
    content_fr: defineCollection({
      source: {
        include: "fr/**",
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_en: defineCollection({
      source: {
        include: "en/**",
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_de: defineCollection({
      source: {
        include: "de/**",
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_es: defineCollection({
      source: {
        include: "es/**",
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_it: defineCollection({
      source: {
        include: "it/**",
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
    content_pt: defineCollection({
      source: {
        include: "pt/**",
        prefix: "",
      },
      schema: rulesSchema,
      type: "page",
    }),
  },
});