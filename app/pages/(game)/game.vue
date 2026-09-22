<script lang="ts" setup>
import { nextTick } from "vue";

import { ConfirmDialog, GameTutorial } from "#components";

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

const isLeaveConfirmationOpen = ref<boolean>(false);

async function confirmLeave(): Promise<boolean> {
  isLeaveConfirmationOpen.value = true;

  try {
    const modal = overlay.create(ConfirmDialog, {
      destroyOnClose: true,
      props: {
        disableShortcuts: true,
        dismissible: false,
        icon: "i-lucide-log-out",
        iconClass: "text-warning",
        title: t("game.leaveConfirmTitle"),
        description: t("game.leaveConfirmDescription"),
        primaryButtonLabel: t("game.leave"),
      },
    });

    return await modal.open();
  } finally {
    isLeaveConfirmationOpen.value = false;
  }
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
  isFetchingQuestions,
  isTranslating,
  questions,
} = useGame();

const isTutorialAvailable = computed<boolean>(() => gameState.value === "playing" && currentQuestion.value !== undefined && !isTranslating.value && !isFetchingQuestions.value);

const isTourRequested = ref<boolean>(false);

async function startTutorial(): Promise<void> {
  isSidebarOpen.value = false;
  isTourRequested.value = false;
  await nextTick();
  isTourRequested.value = true;
}

const { acceptFromSidebar } = useGameTutorialInvitation({
  gameState,
  isTutorialAvailable,
  onStartTutorial: startTutorial,
});

function onStartTutorialFromSidebar(): void {
  acceptFromSidebar();
  void startTutorial();
}

function onTourEnd(): void {
  isTourRequested.value = false;
}

watch(currentIndex, () => {
  isTourRequested.value = false;
});

const pageThemeColor = computed<string>(() => (currentQuestion.value ? resolveThemeColor(getPrimaryTheme(currentQuestion.value)?.color) : NEUTRAL_GREY_FALLBACK_THEME_COLOR));

const isSidebarOpen = ref(false);

function openSidebar(): void {
  isSidebarOpen.value = true;
}

function onSidebarOpenChange(open: boolean): void {
  isSidebarOpen.value = open;
}

const areShortcutsDisabled = computed<boolean>(() => isSidebarOpen.value || isTourRequested.value || isLeaveConfirmationOpen.value);
</script>

<template>
  <div
    id="game-page"
    class="bg-app-bg flex flex-col game-theme-scope md:px-6 min-h-dvh overflow-hidden px-4"
    :style="{ '--game-theme-color': pageThemeColor }"
  >
    <h1 class="sr-only">
      {{ gamePageTitle }}
    </h1>

    <GameSidebarToggleButton
      class="absolute left-4 top-4 z-20"
      @click="openSidebar"
    />

    <GameSidebar
      :is-fetching-questions="isFetchingQuestions"
      :is-tutorial-available="isTutorialAvailable"
      :open="isSidebarOpen"
      @start-tutorial="onStartTutorialFromSidebar"
      @update:open="onSidebarOpenChange"
    />

    <GameTutorial
      v-if="isTutorialAvailable"
      :is-active="isTourRequested"
      @tutorial-end="onTourEnd"
    />

    <Transition
      mode="out-in"
      name="fade-slide-up"
    >
      <GameLoading
        v-if="isTranslating || gameState === 'loading'"
        :is-translating="isTranslating"
      />

      <GamePlaying
        v-else-if="gameState === 'playing' && currentQuestion"
        :are-shortcuts-disabled="areShortcutsDisabled"
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