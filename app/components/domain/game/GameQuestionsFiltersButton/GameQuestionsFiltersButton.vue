<script lang="ts" setup>
import type { GameQuestionsFiltersButtonEmits } from "@/components/domain/game/GameQuestionsFiltersButton/game-questions-filters-button.types";
import { GAME_QUESTIONS_FILTERS_BUTTON_UI } from "@/components/domain/game/GameQuestionsFiltersButton/game-questions-filters-button.constants";

const emit = defineEmits<GameQuestionsFiltersButtonEmits>();
const { t } = useI18n();

const accessibleName = computed<string>(() => t("game.questionsFilters.triggerLabel"));
const tooltipText = computed<string>(() => t("game.questionsFilters.triggerTooltip"));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UTooltip
    portal="main"
    :text="tooltipText"
  >
    <UButton
      :aria-label="accessibleName"
      class="game-question-navigation-button--themed h-10 rounded-full w-10"
      color="neutral"
      data-testid="game-questions-filters-button"
      icon="i-lucide-funnel"
      size="lg"
      :ui="GAME_QUESTIONS_FILTERS_BUTTON_UI"
      variant="outline"
      @click="onClick"
    />
  </UTooltip>
</template>