const GAME_SETTINGS_TAB_GENERAL = "general";

const GAME_SETTINGS_TAB_ABOUT = "about";

const GAME_SETTINGS_MODAL_UI = {
  content: "min-h-64 sm:min-h-80",
} as const;

const GAME_SETTINGS_MODAL_TABS_UI = {
  trigger: "basis-0",
} as const;

export { GAME_SETTINGS_MODAL_TABS_UI, GAME_SETTINGS_MODAL_UI, GAME_SETTINGS_TAB_ABOUT, GAME_SETTINGS_TAB_GENERAL };