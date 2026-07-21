<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { getPrimaryTheme } from "~/composables/domain/question/helpers/question.helpers";
import { resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR } from "~/composables/domain/question-theme/constants/question-theme.constants";
import type { Question } from "#shared/types/question.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY, GAME_PAGE_TITLE_KEY, GAME_PREFETCH_THRESHOLD } from "@/pages/(game)/game.constants";

const { t } = useI18n();

const gamePageTitle = computed<string>(() => t(GAME_PAGE_TITLE_KEY));

useHead(() => ({
  title: gamePageTitle.value,
}));

const store = useQuestionsStore();
const { questions, isPending } = storeToRefs(store);

const currentIndex = ref<number>(0);
const hasTriggeredPrefetch = ref<boolean>(false);

const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);

const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && isPending.value);

const isOutOfQuestionsLoading = computed<boolean>(() => currentIndex.value >= questions.value.length && isPending.value);

const pageThemeColor = computed<string>(() => (currentQuestion.value ? resolveThemeColor(getPrimaryTheme(currentQuestion.value)?.color) : NEUTRAL_GREY_FALLBACK_THEME_COLOR));

const prefetchThreshold = computed<number>(() => Math.floor(questions.value.length * GAME_PREFETCH_THRESHOLD));

callOnce(() => store.fetchAndAppendRandomQuestions(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY));

watch(currentIndex, index => {
  if (index >= prefetchThreshold.value && !isPending.value && !hasTriggeredPrefetch.value) {
    hasTriggeredPrefetch.value = true;
    store.fetchAndAppendRandomQuestions(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY);
  }
});

watch(isPending, pending => {
  if (!pending) {
    hasTriggeredPrefetch.value = false;
  }
});

function advanceToNextQuestion(): void {
  currentIndex.value++;
}
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
      <p
        v-if="isInitialLoading || isOutOfQuestionsLoading"
        class="text-sm text-text-secondary"
      >
        {{ $t("game.loadingQuestions") }}
      </p>

      <GameQuestionCard
        v-else-if="currentQuestion"
        class="w-full"
        :question="currentQuestion"
      />
    </div>

    <div
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