import { isValidLocale } from "@goat-it/schemas/shared/locale";
import type { Locale } from "@goat-it/schemas/shared/locale";
import { usePreferredLanguages } from "@vueuse/core";

import { CookieNames } from "#shared/enums/cookie.enums";
import { resolveSuggestedLocale } from "#shared/utils/helpers/locale/locale.helpers";
import { LOCALE_COOKIE_OPTIONS } from "@/app.constants";
import type { UseLocaleSuggestionReturn } from "@/composables/ui/useLocaleSuggestion/use-locale-suggestion.types";
import type { Toast } from "#ui/composables";

/**
 * Proposes switching to the locale suggested by the browser's preferred languages.
 *
 * Performs its one-shot side effect during setup and returns `Promise<void>` when the flow is in place. It is a
 * no-op when the locale cookie already holds a valid locale, or when no valid
 * suggestion differs from the current locale. Otherwise it loads the suggested
 * messages before showing a persistent toast: accept writes the locale cookie and
 * applies the locale, while decline or close writes the current locale. If applying
 * the locale fails, the cookie is cleared and an error toast is shown.
 */
async function useLocaleSuggestion(): UseLocaleSuggestionReturn {
  const { addErrorToast, addInfoToast, removeToast } = useAppToast();
  const { $i18n } = useNuxtApp();
  const localeCookie = useCookie<string | undefined>(CookieNames.LOCALE, LOCALE_COOKIE_OPTIONS);
  const preferredLanguages = usePreferredLanguages();

  if (localeCookie.value !== undefined && isValidLocale(localeCookie.value)) {
    return;
  }

  const suggestedLocale = resolveSuggestedLocale(preferredLanguages.value);
  const currentLocale = $i18n.locale.value;

  if (suggestedLocale === undefined || suggestedLocale === currentLocale) {
    return;
  }

  const targetLocale = suggestedLocale;

  try {
    await $i18n.loadLocaleMessages(targetLocale);
  } catch(error: unknown) {
    console.error("Failed to load the suggested locale messages", error);

    return;
  }

  let isHandled = false;

  function handleAccept(): void {
    isHandled = true;
    localeCookie.value = targetLocale;
    removeToast(suggestionToast.id);
    void applySuggestedLocale(targetLocale);
  }

  async function applySuggestedLocale(locale: Locale): Promise<void> {
    try {
      await $i18n.setLocale(locale);
    } catch(error: unknown) {
      localeCookie.value = undefined;
      console.error("Failed to apply the suggested locale", error);
      addErrorToast({ title: $i18n.t("common.error"), description: $i18n.t("errors.unknown") });
    }
  }

  function handleDecline(): void {
    isHandled = true;
    localeCookie.value = currentLocale;
    removeToast(suggestionToast.id);
  }

  function handleOpenUpdate(open: boolean): void {
    if (open || isHandled) {
      return;
    }
    localeCookie.value = currentLocale;
  }

  function translateInSuggestedLocale(key: string): string {
    return $i18n.t(key, {}, { locale: targetLocale });
  }

  const suggestionToastOptions: Partial<Toast> = {
    "title": translateInSuggestedLocale("common.localeSuggestion.title"),
    "description": translateInSuggestedLocale("common.localeSuggestion.description"),
    "type": "background",
    "duration": 0,
    "icon": "i-lucide-languages",
    "actions": [
      {
        label: translateInSuggestedLocale("common.localeSuggestion.accept"),
        size: "md",
        color: "primary",
        leadingIcon: "i-lucide-languages",
        onClick: handleAccept,
      },
      {
        label: translateInSuggestedLocale("common.localeSuggestion.decline"),
        color: "neutral",
        onClick: handleDecline,
      },
    ],
    "onUpdate:open": handleOpenUpdate,
  };

  const suggestionToast = addInfoToast(suggestionToastOptions);
}

export { useLocaleSuggestion };