import path from "node:path";

import type { SizeLimitConfig } from "size-limit";

const outputDirectory = process.env.SIZE_LIMIT_OUTPUT_DIR ?? path.resolve(process.cwd(), ".output/public/_nuxt");

const SIZE_LIMIT_CONFIG = [
  {
    name: "nuxt-js",
    path: [path.join(outputDirectory, "**/*.js")],
    limit: "627466 B",
  },
  {
    name: "nuxt-css",
    path: [path.join(outputDirectory, "**/*.css")],
    limit: "22912 B",
  },
] satisfies SizeLimitConfig;

export default SIZE_LIMIT_CONFIG;