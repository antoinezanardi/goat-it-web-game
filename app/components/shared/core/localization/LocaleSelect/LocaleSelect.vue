<script setup lang="ts">
import type { ArrayValues } from "type-fest";

import type { Locale } from "#ui/types";
import { LOCALE_SELECT_UI } from "~/components/shared/core/localization/LocaleSelect/locale-select.constants";

type SupportedLocale = ArrayValues<typeof localeCodes.value>;

const { locale: currentLocale, setLocale, locales, localeCodes } = useI18n();

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return localeCodes.value.includes(locale as SupportedLocale);
}

async function onLocaleChange(updatedLocale: string): Promise<void> {
  if (!isSupportedLocale(updatedLocale)) {
    return;
  }
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