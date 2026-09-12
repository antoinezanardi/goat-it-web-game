<script lang="ts" setup>
import type { GameQuestionCardContextAccordionProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/game-question-card-context-accordion.types";
import { GAME_QUESTION_CARD_CONTEXT_ACCORDION_BUTTON_UI, GAME_QUESTION_CARD_CONTEXT_ACCORDION_COLLAPSIBLE_UI } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/game-question-card-context-accordion.constants";
import { getNonEmptyTrivia, hasNonEmptyContext } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameQuestionCardContextAccordionProps>();

const isOpen = ref<boolean>(false);
const hasContext = computed<boolean>(() => hasNonEmptyContext(props.context));
const filteredTrivia = computed<string[]>(() => getNonEmptyTrivia(props.trivia));
const hasTrivia = computed<boolean>(() => filteredTrivia.value.length > 0);

watch(() => [props.context, props.trivia], () => {
  isOpen.value = false;
});
</script>

<template>
  <UCollapsible
    v-model:open="isOpen"
    :ui="GAME_QUESTION_CARD_CONTEXT_ACCORDION_COLLAPSIBLE_UI"
  >
    <UButton
      block
      class="bg-content border border-(--game-theme-border) game-question-accordion--themed group justify-between min-h-10 rounded-lg"
      color="neutral"
      data-testid="game-question-context-accordion-trigger"
      leading-icon="i-lucide-file-text"
      trailing-icon="i-lucide-chevron-down"
      :ui="GAME_QUESTION_CARD_CONTEXT_ACCORDION_BUTTON_UI"
      variant="outline"
    >
      <span class="font-medium text-fg-primary text-sm">
        {{ $t("questions.contextAccordionTitle") }}
      </span>
    </UButton>

    <template #content>
      <div class="bg-content border border-(--game-theme-border) game-question-accordion--themed mt-1 p-4 rounded-lg">
        <p
          v-if="hasContext"
          class="leading-body text-fg-primary text-sm"
          data-testid="game-question-context"
        >
          {{ props.context?.trim() }}
        </p>

        <GameQuestionCardTriviaContent
          v-if="hasTrivia"
          :class="{ 'mt-3': hasContext }"
          :trivia="filteredTrivia"
        />
      </div>
    </template>
  </UCollapsible>
</template>