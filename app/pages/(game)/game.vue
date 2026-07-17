<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types.ts";

import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY, GAME_PAGE_TITLE_KEY, GAME_PREFETCH_THRESHOLD } from "@/pages/(game)/game.constants";

const { t } = useI18n();

useHead(() => ({
  title: t(GAME_PAGE_TITLE_KEY),
}));

const store = useQuestionsStore();
const { questions, isPending } = storeToRefs(store);

const currentIndex = ref<number>(0);
const hasTriggeredPrefetch = ref<boolean>(false);

const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);

const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && isPending.value);

const isOutOfQuestionsLoading = computed<boolean>(() => currentIndex.value >= questions.value.length && isPending.value);

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
  <div id="game-page">
    <p v-if="isInitialLoading || isOutOfQuestionsLoading">
      {{ $t("game.loadingQuestions") }}
    </p>

    <div v-else-if="currentQuestion">
      <GameQuestionCard :question="currentQuestion"/>

      <button
        data-testid="game-next-button"
        type="button"
        @click="advanceToNextQuestion"
      >
        {{ $t("game.nextQuestion") }}
      </button>
    </div>
  </div>
</template>