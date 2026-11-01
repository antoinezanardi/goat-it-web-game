import { z } from "zod";

import { DEFAULT_COOKIE_OPTIONS } from "#shared/constants/cookie.constants";

const CHANGELOG_STATE_COOKIE_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  secure: import.meta.env.PROD,
} as const;

const CHANGELOG_STATE_SCHEMA = z.object({
  lastSeenVersion: z.string().min(1),
  lastNotifiedVersion: z.string().min(1),
});

export { CHANGELOG_STATE_COOKIE_OPTIONS, CHANGELOG_STATE_SCHEMA };