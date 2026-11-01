<script setup lang="ts">
import { isValidLocale } from "@goat-it/schemas/shared/locale";

import { CookieNames } from "#shared/enums/cookie.enums";
import type { Locale } from "#ui/types";
import { LOCALE_COOKIE_OPTIONS } from "@/app.constants";
import type { LocaleSelectProps } from "@/components/shared/core/localization/LocaleSelect/locale-select.types";
import { LOCALE_SELECT_UI } from "@/components/shared/core/localization/LocaleSelect/locale-select.constants";

const props = defineProps<LocaleSelectProps>();
const { locale: currentLocale, setLocale, locales } = useI18n();
const localeCookie = useCookie<string | null>(CookieNames.LOCALE, LOCALE_COOKIE_OPTIONS);
const selectLocales = computed<Locale<undefined>[]>(() => locales.value.map(locale => ({
  code: locale.code,
  dir: locale.dir === "rtl" ? "rtl" : "ltr",
  messages: undefined,
  name: locale.name ?? locale.code,
})));

async function onLocaleChange(updatedLocale: string): Promise<void> {
  if (!isValidLocale(updatedLocale)) {
    return;
  }
  localeCookie.value = updatedLocale;
  await setLocale(updatedLocale);
}
</script>

<template>
  <ULocaleSelect
    data-testid="locale-select"
    :disabled="props.disabled"
    :locales="selectLocales"
    :model-value="currentLocale"
    :ui="LOCALE_SELECT_UI"
    @update:model-value="onLocaleChange"
  />
</template>