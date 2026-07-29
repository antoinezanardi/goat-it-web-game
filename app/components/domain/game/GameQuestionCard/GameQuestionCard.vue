<script lang="ts" setup>
import type { GameQuestionCardProps } from "@/components/domain/game/GameQuestionCard/game-question-card.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { getPrimaryTheme } from "~/composables/domain/question/helpers/question.helpers";
import { resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardProps>();

const primaryTheme = computed<QuestionTheme | undefined>(() => getPrimaryTheme(props.question));
const themeColor = computed<string>(() => resolveThemeColor(primaryTheme.value?.color));

const hasContextSection = computed<boolean>(() => Boolean(props.question.content.context) || (props.question.content.trivia?.length ?? 0) > 0);

const articleStyle = computed<Record<string, string>>(() => ({
  "--game-theme-color": themeColor.value,
  "border": "1px solid var(--game-theme-border)",
}));
</script>

<template>
  <article
    class="bg-card flex flex-col game-card-halo game-theme-scope h-[calc(100dvh-10rem)] max-w-3xl md:max-h-[650px] md:p-6 mx-auto p-4 rounded-xl"
    data-testid="game-question"
    :style="articleStyle"
  >
    <div
      class="flex-1 min-h-0 overflow-y-auto"
      data-testid="game-question-body"
    >
      <GameQuestionCardThemeHeader
        v-if="primaryTheme"
        :category="props.question.category"
        :difficulty="props.question.cognitiveDifficulty"
        :theme="primaryTheme"
      />

      <GameQuestionCardStatement
        class="mt-4"
        :text="props.question.content.statement"
      />

      <GameQuestionCardThemeSeparator class="my-3"/>

      <GameQuestionCardAnswer
        :text="props.question.content.answer"
      />

      <GameQuestionCardContextAccordion
        v-if="hasContextSection"
        class="mt-4"
        :context="props.question.content.context"
        :trivia="props.question.content.trivia"
      />
    </div>

    <GameQuestionCardSourceList
      class="pt-4 shrink-0"
      :source-urls="props.question.sourceUrls"
    />
  </article>
</template>

<style scoped>
.game-card-halo {
  box-shadow:
    0 0 14px var(--game-theme-halo-near),
    0 0 36px var(--game-theme-halo-far);
}
</style>