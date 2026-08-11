const HOME_PAGE_PLAY_BUTTON_UI = {
  base: "bg-black text-white rounded-[0.5em] shadow-[2px_2px_3px_rgba(0,0,0,0.7)] px-25 py-2.5 text-3xl hover:bg-black/90 active:bg-black/90 outline-white/25",
  label: "text-white font-bold uppercase tracking-widest",
} as const;

const HOME_HOW_TO_PLAY_BUTTON_UI = {
  base: "fixed bottom-6 left-6",
  label: "text-fg-secondary",
} as const;

export {
  HOME_HOW_TO_PLAY_BUTTON_UI,
  HOME_PAGE_PLAY_BUTTON_UI,
};