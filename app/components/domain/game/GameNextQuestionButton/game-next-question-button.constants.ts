import { GAME_INTERACTIVE_BUTTON_UI } from "@/utils/ui/game/game-buttons.constants";

const GAME_NEXT_QUESTION_BUTTON_UI = {
  ...GAME_INTERACTIVE_BUTTON_UI,
  label: "text-fg-primary",
  trailingIcon: "text-(color:--game-theme-neon)",
} as const;

export { GAME_NEXT_QUESTION_BUTTON_UI };