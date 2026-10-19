import { z } from "zod";

const SAFE_SOURCE_URL_SCHEMA = z.url({ protocol: /^https$/u }).refine(url => (/^https:\/\//iu).test(url));

export { SAFE_SOURCE_URL_SCHEMA };