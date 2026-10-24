const GAME_TUTORIAL_CONTROL_ICONS = {
  back: "i-lucide-arrow-left",
  finish: "i-lucide-check",
  next: "i-lucide-arrow-right",
  skip: "i-lucide-x",
} as const;

const GAME_TUTORIAL_SKIP_SHORTCUT = {
  ariaKeyshortcuts: "Escape",
  kbd: "escape",
} as const;

export { GAME_TUTORIAL_CONTROL_ICONS, GAME_TUTORIAL_SKIP_SHORTCUT };