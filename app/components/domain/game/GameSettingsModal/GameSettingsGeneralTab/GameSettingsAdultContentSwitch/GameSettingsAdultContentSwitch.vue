<script lang="ts" setup>
import {
  GAME_SETTINGS_ADULT_CONTENT_SWITCH_DESCRIPTION_ID,
  GAME_SETTINGS_ADULT_CONTENT_SWITCH_INPUT_ID,
} from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsAdultContentSwitch/game-settings-adult-content-switch.constants";
import type {
  GameSettingsAdultContentSwitchEmits,
  GameSettingsAdultContentSwitchProps,
} from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsAdultContentSwitch/game-settings-adult-content-switch.types";
import { QUESTION_ADULT_CONTENT_ICON } from "~/composables/domain/question/constants/question.constants";

const props = defineProps<GameSettingsAdultContentSwitchProps>();
const emit = defineEmits<GameSettingsAdultContentSwitchEmits>();

const { t } = useI18n();

const iconClass = computed<string>(() => (props.isAdultContentEnabled ? "text-primary" : "text-muted"));
const descriptionKey = computed<string>(() => (props.isAdultContentEnabled ? "game.settings.adultContent.descriptionEnabled" : "game.settings.adultContent.descriptionDisabled"));

function onUpdateValue(value: boolean): void {
  emit("update:isAdultContentEnabled", value);
}
</script>

<template>
  <div
    class="flex flex-col gap-1"
    data-testid="game-settings-adult-content-switch"
  >
    <div class="flex gap-2 items-center justify-between">
      <label
        class="cursor-pointer flex font-medium gap-2 items-center text-fg-primary text-sm"
        data-testid="game-settings-adult-content-label"
        :for="GAME_SETTINGS_ADULT_CONTENT_SWITCH_INPUT_ID"
      >
        <UIcon
          class="cursor-pointer duration-200 shrink-0 size-5 transition-colors"
          :class="iconClass"
          data-testid="game-settings-adult-content-icon"
          :name="QUESTION_ADULT_CONTENT_ICON"
        />
        {{ t("game.settings.adultContent.label") }}
      </label>

      <USwitch
        :id="GAME_SETTINGS_ADULT_CONTENT_SWITCH_INPUT_ID"
        :aria-describedby="GAME_SETTINGS_ADULT_CONTENT_SWITCH_DESCRIPTION_ID"
        color="primary"
        :model-value="props.isAdultContentEnabled"
        @update:model-value="onUpdateValue"
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