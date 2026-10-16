import { COOKIE_MAX_AGE_IN_SECONDS } from "#shared/constants/cookie.constants";

const GAME_SETTINGS_COOKIE_OPTIONS = {
  path: "/",
  maxAge: COOKIE_MAX_AGE_IN_SECONDS,
  sameSite: "lax",
} as const;

export { GAME_SETTINGS_COOKIE_OPTIONS };