<script lang="ts" setup>
import { getPrimaryTheme } from "~/composables/domain/question/helpers/question.helpers";
import { resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR } from "~/composables/domain/question-theme/constants/question-theme.constants";
import { GAME_PAGE_TITLE_KEY } from "@/pages/(game)/game.constants";

const { t } = useI18n();

const gamePageTitle = computed<string>(() => t(GAME_PAGE_TITLE_KEY));

useHead(() => ({
  title: gamePageTitle.value,
}));

const {
  currentQuestion,
  advanceToNextQuestion,
  isInitialLoading,
  isOutOfQuestionsLoading,
  isGameOver,
} = useGame();

const pageThemeColor = computed<string>(() => (currentQuestion.value ? resolveThemeColor(getPrimaryTheme(currentQuestion.value)?.color) : NEUTRAL_GREY_FALLBACK_THEME_COLOR));
</script>

<template>
  <div
    id="game-page"
    class="bg-app-bg flex flex-col game-theme-scope md:px-6 min-h-dvh px-4"
    :style="{ '--game-theme-color': pageThemeColor }"
  >
    <h1 class="sr-only">
      {{ gamePageTitle }}
    </h1>

    <div class="flex flex-1 flex-col items-center justify-center py-6">
      <GameNoMoreQuestions v-if="isGameOver"/>

      <template v-else>
        <p
          v-if="isInitialLoading || isOutOfQuestionsLoading"
          class="text-fg-secondary text-sm"
          data-testid="game-loading"
        >
          {{ $t("game.loadingQuestions") }}
        </p>

        <GameQuestionCard
          v-else-if="currentQuestion"
          class="w-full"
          :question="currentQuestion"
        />
      </template>
    </div>

    <div
      v-if="!isGameOver && !isOutOfQuestionsLoading"
      class="bottom-0 flex flex-col max-w-3xl mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sticky w-full"
    >
      <GameNextButton
        :disabled="!currentQuestion"
        :loading="isOutOfQuestionsLoading"
        @click="advanceToNextQuestion"
      />
    </div>
  </div>
</template>