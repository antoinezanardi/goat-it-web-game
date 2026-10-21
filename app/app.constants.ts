import type { ToasterProps } from "#ui/components/Toaster.vue";
import type { TooltipProps } from "#ui/components/Tooltip.vue";
import { DEFAULT_COOKIE_OPTIONS } from "#shared/constants/cookie.constants";

const APP_TOOLTIP_CONFIG = {
  delayDuration: 0,
} as const satisfies TooltipProps;

const APP_TOAST_CONFIG = {
  duration: 4000,
} as const satisfies ToasterProps;

const LOCALE_COOKIE_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  secure: import.meta.env.PROD,
} as const;

export {
  APP_TOOLTIP_CONFIG,
  APP_TOAST_CONFIG,
  LOCALE_COOKIE_OPTIONS,
};