import { z } from "zod";

const SEO_META_TAG_ROW_SCHEMA = z.strictObject({
  type: z.enum(["name", "property"]),
  key: z.string(),
  content: z.string(),
});

type SeoMetaTagRow = z.infer<typeof SEO_META_TAG_ROW_SCHEMA>;

export { SEO_META_TAG_ROW_SCHEMA };

export type { SeoMetaTagRow };