<script lang="ts" setup>
import { UButton } from "#components";

import { resolveHTMLElement } from "@/utils/core/element/element.dom.helpers";
import { GAME_INTERACTIVE_BUTTON_UI } from "@/utils/ui/game/game-buttons.constants";
import type { GameQuestionsFiltersButtonEmits, GameQuestionsFiltersButtonExposed } from "@/components/domain/game/GameQuestionsFiltersButton/game-questions-filters-button.types";

const emit = defineEmits<GameQuestionsFiltersButtonEmits>();
const { t } = useI18n();

const highlight = useQuestionCardHighlight();
const buttonElementReference = useTemplateRef<InstanceType<typeof UButton>>("buttonElementReference");

const { activeFiltersCount } = useGameQuestionsFilters();

const accessibleName = computed<string>(() => t("game.questionsFilters.triggerLabel"));
const tooltipText = computed<string>(() => t("game.questionsFilters.triggerTooltip"));

async function playHighlight(): Promise<void> {
  const buttonElement = resolveHTMLElement(buttonElementReference.value);
  if (buttonElement === undefined) {
    return;
  }
  await highlight.animate([buttonElement]);
}

function onClick(): void {
  emit("click");
}

const exposed: GameQuestionsFiltersButtonExposed = {
  playHighlight,
};

defineExpose(exposed);
</script>

<template>
  <UTooltip
    portal="main"
    :text="tooltipText"
  >
    <div class="relative">
      <UButton
        ref="buttonElementReference"
        :aria-label="accessibleName"
        class="game-question-navigation-button--themed h-10 rounded-full w-10"
        color="neutral"
        data-testid="game-questions-filters-button"
        icon="i-lucide-funnel"
        size="lg"
        :ui="GAME_INTERACTIVE_BUTTON_UI"
        variant="outline"
        @click="onClick"
      />

      <GameQuestionsFiltersCountBadge
        v-if="activeFiltersCount > 0"
        class="-right-1 -top-1 absolute pointer-events-none"
        :count="activeFiltersCount"
        data-testid="game-questions-filters-button-badge"
      />
    </div>
  </UTooltip>
</template>