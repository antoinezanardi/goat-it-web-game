<script lang="ts" setup>
import {
  GAME_SETTINGS_ADULT_CONTENT_SWITCH_DESCRIPTION_ID,
  GAME_SETTINGS_ADULT_CONTENT_SWITCH_INPUT_ID,
} from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsAdultContentSwitch/game-settings-adult-content-switch.constants";
import { QUESTION_ADULT_CONTENT_ICON } from "~/composables/domain/question/constants/question.constants";

const store = useGameSettingsStore();
const { t } = useI18n();

const isAdultContentEnabled = computed<boolean>({
  get: () => store.isAdultContentEnabled,
  set: (value: boolean): void => store.setAdultContentEnabled(value),
});

const iconClass = computed<string>(() => (isAdultContentEnabled.value ? "text-secondary" : "text-muted"));
const descriptionKey = computed<string>(() => (isAdultContentEnabled.value ? "game.settings.adultContent.descriptionEnabled" : "game.settings.adultContent.descriptionDisabled"));
</script>

<template>
  <div
    class="flex flex-col gap-1"
    data-testid="game-settings-adult-content-switch"
  >
    <div class="flex gap-2 items-center justify-between">
      <label
        class="flex font-medium gap-2 items-center text-fg-primary text-sm"
        data-testid="game-settings-adult-content-label"
        :for="GAME_SETTINGS_ADULT_CONTENT_SWITCH_INPUT_ID"
      >
        <UIcon
          class="shrink-0 size-5"
          :class="iconClass"
          data-testid="game-settings-adult-content-icon"
          :name="QUESTION_ADULT_CONTENT_ICON"
        />
        {{ t("game.settings.adultContent.label") }}
      </label>

      <USwitch
        :id="GAME_SETTINGS_ADULT_CONTENT_SWITCH_INPUT_ID"
        v-model="isAdultContentEnabled"
        :aria-describedby="GAME_SETTINGS_ADULT_CONTENT_SWITCH_DESCRIPTION_ID"
        color="secondary"
      />
    </div>

    <span
      :id="GAME_SETTINGS_ADULT_CONTENT_SWITCH_DESCRIPTION_ID"
      class="text-muted text-sm"
      data-testid="game-settings-adult-content-description"
    >
      {{ t(descriptionKey) }}
    </span>
  </div>
</template>