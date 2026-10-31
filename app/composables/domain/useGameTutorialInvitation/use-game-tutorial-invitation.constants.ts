import { DEFAULT_COOKIE_OPTIONS } from "#shared/constants/cookie.constants";

const GAME_TUTORIAL_INVITATION_TOAST_ID = "game-tutorial-invitation";

const GAME_TUTORIAL_INVITATION_DECISION_COOKIE_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  secure: import.meta.env.PROD,
} as const;

export {
  GAME_TUTORIAL_INVITATION_DECISION_COOKIE_OPTIONS,
  GAME_TUTORIAL_INVITATION_TOAST_ID,
};