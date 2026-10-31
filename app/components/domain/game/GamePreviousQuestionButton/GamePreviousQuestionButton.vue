<script lang="ts" setup>
import type { GamePreviousQuestionButtonEmits, GamePreviousQuestionButtonProps } from "@/components/domain/game/GamePreviousQuestionButton/game-previous-question-button.types";
import { GAME_INTERACTIVE_BUTTON_UI } from "@/utils/ui/game/game-buttons.constants";
import { GAME_ARROW_SHORTCUT_KBDS, GAME_ARROW_SHORTCUTS, GAME_SHORTCUT_TOOLTIP_KBD_UI } from "@/utils/ui/game/game-shortcuts.constants";

const props = defineProps<GamePreviousQuestionButtonProps>();
const emit = defineEmits<GamePreviousQuestionButtonEmits>();
const { t } = useI18n();

const backwardShortcut = GAME_ARROW_SHORTCUTS.backward;
const ariaLabel = computed<string>(() => t("game.previousQuestionTooltip"));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UTooltip
    :kbds="GAME_ARROW_SHORTCUT_KBDS.backward"
    :text="ariaLabel"
    :ui="GAME_SHORTCUT_TOOLTIP_KBD_UI"
  >
    <UButton
      :aria-keyshortcuts="backwardShortcut.ariaKeyshortcuts"
      :aria-label="ariaLabel"
      class="game-question-navigation-button--themed h-10 rounded-full w-10"
      color="neutral"
      data-testid="game-previous-question-button"
      :disabled="props.disabled"
      icon="i-lucide-arrow-left"
      size="lg"
      :ui="GAME_INTERACTIVE_BUTTON_UI"
      variant="outline"
      @click="onClick"
    />
  </UTooltip>
</template>