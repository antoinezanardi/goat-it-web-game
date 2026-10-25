import { isValidLocale } from "@goat-it/schemas/shared/locale";

import { DEFAULT_LOCALE_FALLBACK } from "#shared/constants/locale.constants";
import { OFFLINE_PAGE_COPY } from "@/utils/ui/offline/offline-page.constants";
import type { OfflinePageCopy } from "@/utils/ui/offline/offline-page.types";

/**
 * Resolves the static copy used by the prerendered offline page.
 *
 * This runs once at build time, so the fallback is rendered in the deployment default language only.
 * Unsupported or missing locale values fall back to `DEFAULT_LOCALE_FALLBACK`.
 */
function resolveOfflinePageCopy(locale: unknown): OfflinePageCopy {
  const candidateLocale = String(locale);

  return OFFLINE_PAGE_COPY[isValidLocale(candidateLocale) ? candidateLocale : DEFAULT_LOCALE_FALLBACK];
}

export { resolveOfflinePageCopy };