import { CookieNames } from "#shared/enums/cookie.enums";
import { I18N_REDIRECTED_COOKIE_OPTIONS } from "~/composables/core/useLocaleCookie/use-locale-cookie.constants";

function useLocaleCookie(): Ref<string | null> {
  return useCookie<string | null>(CookieNames.I18N_REDIRECTED, I18N_REDIRECTED_COOKIE_OPTIONS);
}

export { useLocaleCookie };