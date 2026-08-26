import { isValidLocale } from "@goat-it/schemas/shared/locale";

import { resolveSuggestedLocale } from "#shared/utils/helpers/locale/locale.helpers";
import type { Toast } from "#ui/composables";
import { I18N_REDIRECTED_COOKIE_MAX_AGE_IN_SECONDS, I18N_REDIRECTED_COOKIE_NAME } from "~/composables/ui/useLocaleSuggestion/use-locale-suggestion.constants";

async function useLocaleSuggestion(): Promise<void> {
  const { addInfoToast, removeToast } = useAppToast();
  const { $i18n } = useNuxtApp();
  const redirectedCookie = useCookie<string | null>(I18N_REDIRECTED_COOKIE_NAME, {
    path: "/",
    maxAge: I18N_REDIRECTED_COOKIE_MAX_AGE_IN_SECONDS,
    sameSite: "lax",
  });

  if (redirectedCookie.value !== null && isValidLocale(redirectedCookie.value)) {
    return;
  }

  const suggestedLocale = resolveSuggestedLocale(navigator.languages);
  const currentLocale = $i18n.locale.value;

  if (suggestedLocale === undefined || suggestedLocale === currentLocale) {
    return;
  }

  const targetLocale = suggestedLocale;

  await $i18n.loadLocaleMessages(targetLocale);

  let isHandled = false;

  function handleAccept(): void {
    isHandled = true;
    redirectedCookie.value = targetLocale;
    void $i18n.setLocale(targetLocale);
    removeToast(suggestionToast.id);
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