const GAME_SIDEBAR_ICONS = {
  backToHome: "i-lucide-house",
  filters: "i-lucide-funnel",
  rules: "i-lucide-book-open",
  settings: "i-lucide-settings",
  tutorial: "i-lucide-compass",
} as const;

const GAME_SIDEBAR_UI = {
  body: "ps-[max(1rem,env(safe-area-inset-left))] sm:ps-[max(1.5rem,env(safe-area-inset-left))]",
  content: "max-w-72",
  footer: "pb-[max(1rem,env(safe-area-inset-bottom))] ps-[max(1rem,env(safe-area-inset-left))] sm:ps-[max(1.5rem,env(safe-area-inset-left))]",
  header: "ps-[max(1rem,env(safe-area-inset-left))] pt-[max(1rem,env(safe-area-inset-top))] sm:ps-[max(1.5rem,env(safe-area-inset-left))]",
} as const;

export { GAME_SIDEBAR_ICONS, GAME_SIDEBAR_UI };