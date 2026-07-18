<script lang="ts" setup>
import type { GameQuestionCardProps } from "./game-question-card.types";

import { getPrimaryTheme, getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardProps>();

const primaryTheme = computed(() => getPrimaryTheme(props.question));
const themeColor = computed(() => resolveThemeColor(primaryTheme.value.color));
const themeIcon = computed(() => getThemeIcon(primaryTheme.value.slug));

const hasContextSection = computed(() => Boolean(props.question.content.context) || (props.question.content.trivia?.length ?? 0) > 0);

const articleStyle = computed(() => ({
  "--game-theme-color": themeColor.value,
  "border": "1px solid var(--game-theme-border)",
}));
</script>

<template>
  <article
    class="bg-card game-card-halo game-theme-scope max-w-3xl md:p-6 mx-auto p-4 rounded-xl"
    data-testid="game-question"
    :style="articleStyle"
  >
    <GameQuestionCardThemeHeader
      :difficulty="props.question.cognitiveDifficulty"
      :icon="themeIcon"
      :theme="primaryTheme"
    />

    <GameQuestionCardContent
      class="mt-4"
      icon="i-lucide-help-circle"
      :label="$t('questions.questionLabel')"
      :text="props.question.content.statement"
      text-test-id="game-question-statement"
      variant="question"
    />

    <GameQuestionCardThemeSeparator class="my-3"/>

    <GameQuestionCardContent
      icon="i-lucide-sparkles"
      :label="$t('questions.answerLabel')"
      :text="props.question.content.answer"
      text-test-id="game-question-answer"
      variant="answer"
    />

    <GameQuestionCardContextAccordion
      v-if="hasContextSection"
      class="mt-4"
      :context="props.question.content.context"
      :trivia="props.question.content.trivia"
    />

    <GameQuestionCardSourceList
      class="mt-4"
      :source-urls="props.question.sourceUrls"
    />
  </article>
</template>