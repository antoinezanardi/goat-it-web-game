import { isValidLocale } from "@goat-it/schemas/shared/locale";
import type { Locale } from "@goat-it/schemas/shared/locale";
import { usePreferredLanguages } from "@vueuse/core";

import { CookieNames } from "#shared/enums/cookie.enums";
import { resolveSuggestedLocale } from "#shared/utils/helpers/locale/locale.helpers";
import { I18N_REDIRECTED_COOKIE_OPTIONS } from "@/app.constants";
import type { UseLocaleSuggestionReturn } from "@/composables/ui/useLocaleSuggestion/use-locale-suggestion.types";
import type { Toast } from "#ui/composables";

async function useLocaleSuggestion(): UseLocaleSuggestionReturn {
  const { addErrorToast, addInfoToast, removeToast } = useAppToast();
  const { $i18n } = useNuxtApp();
  const redirectedCookie = useCookie<string | undefined>(CookieNames.I18N_REDIRECTED, I18N_REDIRECTED_COOKIE_OPTIONS);
  const preferredLanguages = usePreferredLanguages();

  if (redirectedCookie.value !== undefined && isValidLocale(redirectedCookie.value)) {
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
    redirectedCookie.value = targetLocale;
    removeToast(suggestionToast.id);
    void applySuggestedLocale(targetLocale);
  }

  async function applySuggestedLocale(locale: Locale): Promise<void> {
    try {
      await $i18n.setLocale(locale);
    } catch(error: unknown) {
      redirectedCookie.value = undefined;
      console.error("Failed to apply the suggested locale", error);
      addErrorToast({ title: $i18n.t("common.error"), description: $i18n.t("errors.unknown") });
    }
  }

  function handleDecline(): void {
    isHandled = true;
    redirectedCookie.value = currentLocale;
    removeToast(suggestionToast.id);
  }

  function handleOpenUpdate(open: boolean): void {
    if (open || isHandled) {
      return;
    }
    redirectedCookie.value = currentLocale;
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