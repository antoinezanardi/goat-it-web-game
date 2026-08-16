import { NUXT_UI_BUTTONS_CONFIG } from "@/config/buttons.config.ts";

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
    button: NUXT_UI_BUTTONS_CONFIG,
  },
});