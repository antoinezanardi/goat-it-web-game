const EXAMPLE_ROUND_COLLAPSIBLE_UI = { content: "overflow-hidden" } as const;

const EXAMPLE_ROUND_BUTTON_UI = {
  base: "ring-0 bg-content hover:bg-surface-interactive",
  trailingIcon: "group-data-[state=open]:rotate-180 transition-transform duration-200",
} as const;

export {
  EXAMPLE_ROUND_BUTTON_UI,
  EXAMPLE_ROUND_COLLAPSIBLE_UI,
};