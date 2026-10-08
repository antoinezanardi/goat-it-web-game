import { NUXT_UI_BADGES_CONFIG } from "@/config/badges.config.ts";
import { NUXT_UI_BUTTONS_CONFIG } from "@/config/buttons.config.ts";
import { NUXT_UI_POPOVER_CONFIG } from "@/config/popover.config.ts";
import { NUXT_UI_TABS_CONFIG } from "@/config/tabs.config.ts";
import { NUXT_UI_TOAST_CONFIG } from "@/config/toast.config.ts";
import { NUXT_UI_TOOLTIP_CONFIG } from "@/config/tooltip.config.ts";

export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      secondary: "violet",
      success: "emerald",
      info: "cyan",
      warning: "orange",
      error: "red",
      neutral: "zinc",
    },
    badge: NUXT_UI_BADGES_CONFIG,
    button: NUXT_UI_BUTTONS_CONFIG,
    popover: NUXT_UI_POPOVER_CONFIG,
    tabs: NUXT_UI_TABS_CONFIG,
    toast: NUXT_UI_TOAST_CONFIG,
    tooltip: NUXT_UI_TOOLTIP_CONFIG,
    selectMenu: {
      slots: {
        item: "cursor-pointer",
      },
    },
  },
});