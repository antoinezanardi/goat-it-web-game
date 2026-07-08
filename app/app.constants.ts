import type { ToasterProps } from "#ui/components/Toaster.vue";
import type { TooltipProps } from "#ui/components/Tooltip.vue";

const APP_TOOLTIP_CONFIG = {
  delayDuration: 0,
} as const satisfies TooltipProps;

const APP_TOAST_CONFIG = {
  duration: 4000,
} as const satisfies ToasterProps;

export {
  APP_TOOLTIP_CONFIG,
  APP_TOAST_CONFIG,
};