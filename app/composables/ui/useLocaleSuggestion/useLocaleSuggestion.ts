import { isValidLocale } from "@goat-it/schemas/shared/locale";

import { resolveSuggestedLocale } from "#shared/utils/helpers/locale/locale.helpers";
import type { Toast } from "#ui/composables";

const I18N_REDIRECTED_COOKIE_NAME = "i18n_redirected";
const I18N_REDIRECTED_COOKIE_MAX_AGE_IN_SECONDS = 31_536_000;

async function useLocaleSuggestion(): Promise<void> {
  const toast = useToast();
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

  if (suggestedLocale === null || suggestedLocale === currentLocale) {
    return;
  }

  const targetLocale = suggestedLocale;

  await $i18n.loadLocaleMessages(targetLocale);

  let isHandled = false;

  function handleAccept(): void {
    isHandled = true;
    redirectedCookie.value = targetLocale;
    void $i18n.setLocale(targetLocale);
    toast.remove(suggestionToast.id);
  }

  function handleDecline(): void {
    isHandled = true;
    redirectedCookie.value = currentLocale;
    toast.remove(suggestionToast.id);
  }

  function handleOpenUpdate(open: boolean): void {
    if (open || isHandled) {
      return;
    }
    redirectedCookie.value = currentLocale;
  }

  const suggestionToastOptions: Partial<Toast> & Record<"data-nosnippet", string> = {
    "title": $i18n.t("common.localeSuggestion.title", {}, { locale: targetLocale }),
    "description": $i18n.t("common.localeSuggestion.description", {}, { locale: targetLocale }),
    "type": "background",
    "duration": 0,
    "data-nosnippet": "true",
    "actions": [
      { label: $i18n.t("common.localeSuggestion.accept", {}, { locale: targetLocale }), onClick: handleAccept },
      { label: $i18n.t("common.localeSuggestion.decline", {}, { locale: targetLocale }), onClick: handleDecline },
    ],
    "onUpdate:open": handleOpenUpdate,
  };

  const suggestionToast = toast.add(suggestionToastOptions);
}

export { useLocaleSuggestion };