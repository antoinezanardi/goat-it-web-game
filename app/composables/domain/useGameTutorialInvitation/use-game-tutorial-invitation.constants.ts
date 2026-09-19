import { COOKIE_MAX_AGE_IN_SECONDS } from "#shared/constants/cookie.constants";

const GAME_TUTORIAL_INVITATION_TOAST_ID = "game-tutorial-invitation";

const GAME_TUTORIAL_INVITATION_DECISION_COOKIE_OPTIONS = {
  path: "/",
  maxAge: COOKIE_MAX_AGE_IN_SECONDS,
  sameSite: "lax",
} as const;

export {
  GAME_TUTORIAL_INVITATION_DECISION_COOKIE_OPTIONS,
  GAME_TUTORIAL_INVITATION_TOAST_ID,
};