const GAME_SETTINGS_TAB_GENERAL = "general";

const GAME_SETTINGS_TAB_ABOUT = "about";

const GAME_SETTINGS_MODAL_UI = {
  body: "flex flex-col",
  content: "min-h-120 sm:min-h-150",
} as const;

const GAME_SETTINGS_MODAL_TABS_UI = {
  content: "flex flex-1 flex-col",
  root: "flex-1",
  trigger: "basis-0",
} as const;

export { GAME_SETTINGS_MODAL_TABS_UI, GAME_SETTINGS_MODAL_UI, GAME_SETTINGS_TAB_ABOUT, GAME_SETTINGS_TAB_GENERAL };