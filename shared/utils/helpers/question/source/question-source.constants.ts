import { z } from "zod";

const SAFE_SOURCE_URL_SCHEMA = z.url({ protocol: /^https$/u });

export { SAFE_SOURCE_URL_SCHEMA };