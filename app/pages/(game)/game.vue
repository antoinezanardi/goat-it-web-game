<script lang="ts" setup>
import { ConfirmDialog } from "#components";

import { getPrimaryTheme } from "~/composables/domain/question/helpers/question.helpers";
import { resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR } from "~/composables/domain/question-theme/constants/question-theme.constants";
import { GAME_PAGE_TITLE_KEY } from "@/pages/(game)/game.constants";

const { t } = useI18n();

const gamePageTitle = computed<string>(() => t(GAME_PAGE_TITLE_KEY));

useSeoMeta({
  title: () => t("seo.game.title"),
  description: () => t("seo.game.description"),
  ogTitle: () => t("seo.game.title"),
  ogDescription: () => t("seo.game.description"),
});

const overlay = useOverlay();

async function confirmLeave(): Promise<boolean> {
  const modal = overlay.create(ConfirmDialog, {
    props: {
      icon: "i-lucide-triangle-alert",
      title: t("game.leaveConfirmTitle"),
      description: t("game.leaveConfirmDescription"),
      primaryButtonLabel: t("game.leave"),
    },
  });

  return await modal.open().result;
}

onBeforeRouteLeave(async() => {
  if (gameState.value !== "playing") {
    return true;
  }
  return await confirmLeave();
});

const {
  advanceToNextQuestion,
  canGoToPreviousQuestion,
  currentIndex,
  currentQuestion,
  gameState,
  goToPreviousQuestion,
  questions,
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

    <Transition
      mode="out-in"
      name="fade-slide-up"
    >
      <GameLoading v-if="gameState === 'loading'"/>

      <GamePlaying
        v-else-if="gameState === 'playing' && currentQuestion"
        :can-go-to-previous-question="canGoToPreviousQuestion"
        :current-index="currentIndex"
        :current-question="currentQuestion"
        :questions="questions"
        @advance="advanceToNextQuestion"
        @previous="goToPreviousQuestion"
      />

      <GameNoMoreQuestions v-else/>
    </Transition>
  </div>
</template>