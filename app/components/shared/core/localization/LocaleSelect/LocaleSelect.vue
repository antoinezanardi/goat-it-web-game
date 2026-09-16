<script setup lang="ts">
import { isValidLocale } from "@goat-it/schemas/shared/locale";

import type { Locale } from "#ui/types";
import { LOCALE_SELECT_UI } from "~/components/shared/core/localization/LocaleSelect/locale-select.constants";

const { locale: currentLocale, setLocale, locales } = useI18n();
const localeCookie = useLocaleCookie();

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
    :locales="locales as Locale<undefined>[]"
    :model-value="currentLocale"
    :ui="LOCALE_SELECT_UI"
    @update:model-value="onLocaleChange"
  />
</template>