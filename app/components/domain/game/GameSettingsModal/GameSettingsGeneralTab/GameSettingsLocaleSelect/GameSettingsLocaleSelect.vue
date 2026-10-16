<script lang="ts" setup>
import { LocaleSelect } from "#components";

import { GAME_SETTINGS_LOCALE_SELECT_ICON } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsLocaleSelect/game-settings-locale-select.constants";
import type { GameSettingsLocaleSelectProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsLocaleSelect/game-settings-locale-select.types";

const props = defineProps<GameSettingsLocaleSelectProps>();
const { t } = useI18n();
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-testid="game-settings-locale-select"
  >
    <span
      class="flex font-medium gap-2 items-center text-fg-primary text-sm"
      data-testid="game-settings-locale-select-label"
    >
      <UIcon
        class="shrink-0 size-5"
        data-testid="game-settings-locale-select-icon"
        :name="GAME_SETTINGS_LOCALE_SELECT_ICON"
      />
      {{ t("game.settings.languageLabel") }}
    </span>

    <LocaleSelect :disabled="props.isDisabled"/>
  </div>
</template>