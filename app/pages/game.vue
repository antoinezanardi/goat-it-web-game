<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { GAME_DEFAULT_FETCH_QUERY, GAME_PREFETCH_BATCH_SIZE, GAME_PREFETCH_THRESHOLD } from "@/pages/game.constants";

const store = useQuestionsStore();
const { questions, isPending } = storeToRefs(store);

const currentIndex = ref(0);
const hasTriggeredPrefetch = ref(false);

const currentQuestion = computed(() => questions.value[currentIndex.value] ?? questions.value[0]);

const prefetchThreshold = computed(() => Math.floor(questions.value.length * GAME_PREFETCH_THRESHOLD));

callOnce(() => store.fetchAndAppendRandomQuestions(GAME_DEFAULT_FETCH_QUERY));

watch(currentIndex, index => {
  if (index >= prefetchThreshold.value && !isPending.value && !hasTriggeredPrefetch.value) {
    hasTriggeredPrefetch.value = true;
    store.fetchAndAppendRandomQuestions({ ...GAME_DEFAULT_FETCH_QUERY, limit: GAME_PREFETCH_BATCH_SIZE });
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
  <main>
    <p v-if="questions.length === 0 && isPending">
      {{ $t("game.loadingQuestions") }}
    </p>

    <p v-else-if="currentIndex >= questions.length && isPending">
      {{ $t("game.loadingQuestions") }}
    </p>

    <div
      v-else-if="questions.length > 0 && currentQuestion"
      data-testid="game-question"
    >
      <p data-testid="game-question-statement">
        {{ currentQuestion.content.statement }}
      </p>

      <p data-testid="game-question-answer">
        {{ currentQuestion.content.answer }}
      </p>

      <button
        data-testid="game-next-button"
        type="button"
        @click="advanceToNextQuestion"
      >
        {{ $t("game.nextQuestion") }}
      </button>
    </div>
  </main>
</template>