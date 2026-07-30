const GAME_QUESTION_CARD_CONTEXT_ACCORDION_COLLAPSIBLE_UI = { content: "overflow-hidden" } as const;

const GAME_QUESTION_CARD_CONTEXT_ACCORDION_BUTTON_UI = {
  base: "ring-0 bg-content hover:bg-content",
  leadingIcon: "text-(color:--game-theme-neon)",
  trailingIcon: "text-(color:--game-theme-neon) group-data-[state=open]:rotate-180 transition-transform duration-200",
} as const;

export {
  GAME_QUESTION_CARD_CONTEXT_ACCORDION_BUTTON_UI,
  GAME_QUESTION_CARD_CONTEXT_ACCORDION_COLLAPSIBLE_UI,
};