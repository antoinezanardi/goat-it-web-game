const GAME_ARROW_SHORTCUTS = {
  backward: { ariaKeyshortcuts: "ArrowLeft", kbd: "arrowleft" },
  forward: { ariaKeyshortcuts: "ArrowRight", kbd: "arrowright" },
} as const;

const GAME_ARROW_SHORTCUT_KBDS = {
  backward: ["arrowleft"],
  forward: ["arrowright"],
} satisfies Record<"backward" | "forward", string[]>;

const GAME_SHORTCUT_TOOLTIP_KBD_UI = {
  kbds: "hidden items-center shrink-0 gap-0.5 pointer-coarse:hidden pointer-fine:inline-flex",
} as const;

export { GAME_ARROW_SHORTCUT_KBDS, GAME_ARROW_SHORTCUTS, GAME_SHORTCUT_TOOLTIP_KBD_UI };