import { z } from "zod";

import { COOKIE_MAX_AGE_IN_SECONDS } from "#shared/constants/cookie.constants";

const CHANGELOG_STATE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: COOKIE_MAX_AGE_IN_SECONDS,
  sameSite: "lax",
} as const;

const CHANGELOG_STATE_SCHEMA = z.object({
  lastSeenVersion: z.string().min(1),
  lastNotifiedVersion: z.string().min(1),
});

export { CHANGELOG_STATE_COOKIE_OPTIONS, CHANGELOG_STATE_SCHEMA };