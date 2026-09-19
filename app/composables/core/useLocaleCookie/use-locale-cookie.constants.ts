import { COOKIE_MAX_AGE_IN_SECONDS } from "#shared/constants/cookie.constants";

const I18N_REDIRECTED_COOKIE_OPTIONS = {
  path: "/",
  maxAge: COOKIE_MAX_AGE_IN_SECONDS,
  sameSite: "lax",
} as const;

export { I18N_REDIRECTED_COOKIE_OPTIONS };