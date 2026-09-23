<script lang="ts" setup>
import { LocaleSelect } from "#components";

import type { GameSettingsGeneralTabProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/game-settings-general-tab.types";

const props = defineProps<GameSettingsGeneralTabProps>();
const { t } = useI18n();
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-testid="game-settings-general-tab"
  >
    <span
      class="font-medium text-fg-primary text-sm"
      data-testid="game-settings-language-label"
    >
      {{ t("game.settings.languageLabel") }}
    </span>

    <LocaleSelect :disabled="props.isLocaleSelectDisabled"/>
  </div>
</template>