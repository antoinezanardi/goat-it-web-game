<script lang="ts" setup>
const GAME_NO_MORE_QUESTIONS_ICON = "🐐";
</script>

<template>
  <div
    class="flex flex-1 flex-col gap-6 items-center justify-center px-4 py-6"
    data-testid="game-no-more-questions"
  >
    <span
      aria-hidden="true"
      class="text-5xl"
    >{{ GAME_NO_MORE_QUESTIONS_ICON }}</span>

    <p class="font-medium text-center text-fg-primary text-lg">
      {{ $t("game.noMoreQuestions") }}
    </p>

    <UButton
      :label="$t('game.backToHome')"
      size="lg"
      to="/"
    />
  </div>
</template>