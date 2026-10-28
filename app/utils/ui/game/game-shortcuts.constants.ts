const GAME_ARROW_SHORTCUTS = {
  backward: { ariaKeyshortcuts: "ArrowLeft" },
  forward: { ariaKeyshortcuts: "ArrowRight" },
} as const;

const GAME_ARROW_SHORTCUT_KBDS = {
  backward: ["arrowleft"],
} satisfies Record<"backward", string[]>;

const GAME_SHORTCUT_TOOLTIP_KBD_UI = {
  kbds: "hidden items-center shrink-0 gap-0.5 pointer-coarse:hidden pointer-fine:inline-flex",
} as const;

export { GAME_ARROW_SHORTCUT_KBDS, GAME_ARROW_SHORTCUTS, GAME_SHORTCUT_TOOLTIP_KBD_UI };