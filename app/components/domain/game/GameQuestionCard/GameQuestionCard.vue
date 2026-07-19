<script lang="ts" setup>
import type { GameQuestionCardProps } from "@/components/domain/game/GameQuestionCard/game-question-card.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { getPrimaryTheme, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardProps>();

const primaryTheme = computed<QuestionTheme | undefined>(() => getPrimaryTheme(props.question));
const themeColor = computed<string>(() => resolveThemeColor(primaryTheme.value?.color));

const hasContextSection = computed<boolean>(() => Boolean(props.question.content.context) || (props.question.content.trivia?.length ?? 0) > 0);

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
      v-if="primaryTheme"
      :difficulty="props.question.cognitiveDifficulty"
      :theme="primaryTheme"
    />

    <GameQuestionCardStatement
      class="mt-4"
      :text="props.question.content.statement"
      text-test-id="game-question-statement"
    />

    <GameQuestionCardThemeSeparator class="my-3"/>

    <GameQuestionCardAnswer
      :text="props.question.content.answer"
      text-test-id="game-question-answer"
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

<style lang="scss" scoped>
.game-card-halo {
  box-shadow:
    0 0 14px var(--game-theme-halo-near),
    0 0 36px var(--game-theme-halo-far);
}
</style>