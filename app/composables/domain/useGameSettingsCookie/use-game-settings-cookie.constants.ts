import { DEFAULT_COOKIE_OPTIONS } from "#shared/constants/cookie.constants";

const GAME_SETTINGS_COOKIE_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  secure: import.meta.env.PROD,
} as const;

export { GAME_SETTINGS_COOKIE_OPTIONS };