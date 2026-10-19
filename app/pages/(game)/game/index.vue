<script lang="ts" setup>
import { GameQuestionsFiltersButton } from "#components";

import { getPrimaryTheme } from "#shared/utils/helpers/question/themes/question-themes.helpers";
import { resolveThemeColor } from "@/utils/ui/question-theme/helpers/display/question-theme-display.helpers";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR } from "@/utils/ui/question-theme/question-theme.constants";
import { GAME_PAGE_TITLE_KEY } from "@/utils/ui/game-page/game-page.constants";

const { t } = useI18n();

const gamePageTitle = computed<string>(() => t(GAME_PAGE_TITLE_KEY));

useSeoMeta({
  title: () => t("seo.game.title"),
  description: () => t("seo.game.description"),
  ogTitle: () => t("seo.game.title"),
  ogDescription: () => t("seo.game.description"),
});

const {
  syncQuestionsWithGameSettings,
  advanceToNextQuestion,
  canGoToPreviousQuestion,
  currentIndex,
  currentQuestion,
  gameState,
  goToPreviousQuestion,
  resetFilters,
  retry,
  isFetchingQuestions,
  isTranslating,
  questions,
} = useGame();

const filtersButton = useTemplateRef<InstanceType<typeof GameQuestionsFiltersButton>>("filtersButton");

const { isSidebarOpen, openSidebar, closeSidebar, setSidebarOpen } = useGameSidebar();
const { isSettingsModalOpen, openSettingsModal, setSettingsModalOpen } = useGameSettingsModal();
const {
  isFiltersModalOpen,
  isApplyFiltersPending,
  openFiltersModal,
  setFiltersModalOpen,
  requestFiltersModalFromSidebar,
  openRequestedFiltersModal,
  applyFilters,
} = useGameFiltersModal({
  syncQuestionsWithGameSettings,
  getFiltersButton: () => filtersButton.value ?? undefined,
});

const { isLeaveConfirmationOpen } = useGameLeaveConfirmation({ gameState });

const {
  isTutorialAvailable,
  isTourRequested,
  startTutorialFromSidebar,
  endTour,
} = useGameTutorial({
  gameState,
  currentIndex,
  currentQuestion,
  isFetchingQuestions,
  isTranslating,
  closeSidebar,
});

const pageThemeColor = computed<string>(() => (currentQuestion.value ? resolveThemeColor(getPrimaryTheme(currentQuestion.value)?.color) : NEUTRAL_GREY_FALLBACK_THEME_COLOR));

function onOpenSettings(): void {
  closeSidebar();
  void openSettingsModal();
}

function onOpenFiltersFromSidebar(): void {
  requestFiltersModalFromSidebar();
  closeSidebar();
}

const areShortcutsDisabled = computed<boolean>(() => isSidebarOpen.value ||
  isTourRequested.value ||
  isLeaveConfirmationOpen.value ||
  isSettingsModalOpen.value ||
  isFiltersModalOpen.value);
</script>

<template>
  <div
    id="game-page"
    class="bg-app-bg flex flex-col game-theme-scope md:px-6 min-h-dvh overflow-hidden px-4"
    :style="{ '--game-theme-color': pageThemeColor }"
  >
    <div
      class="contents"
      data-testid="game-page-content"
      :inert="isTourRequested"
    >
      <h1 class="sr-only">
        {{ gamePageTitle }}
      </h1>

      <GameSidebarToggleButton
        class="absolute left-4 top-4 z-20"
        @click="openSidebar"
      />

      <div class="absolute right-4 top-4 z-20">
        <GameQuestionsFiltersButton
          ref="filtersButton"
          @click="openFiltersModal"
        />
      </div>

      <GameSidebar
        :is-open="isSidebarOpen"
        :is-tutorial-available="isTutorialAvailable"
        @after:leave="openRequestedFiltersModal"
        @open-filters="onOpenFiltersFromSidebar"
        @open-settings="onOpenSettings"
        @start-tutorial="startTutorialFromSidebar"
        @update:is-open="setSidebarOpen"
      />

      <GameSettingsModal
        :is-fetching-questions="isFetchingQuestions"
        :is-open="isSettingsModalOpen"
        @update:is-open="setSettingsModalOpen"
      />

      <GameQuestionsFiltersModal
        :is-apply-pending="isApplyFiltersPending"
        :is-open="isFiltersModalOpen"
        @apply-filters="applyFilters"
        @update:is-open="setFiltersModalOpen"
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

        <GameFetchError
          v-else-if="gameState === 'error'"
          @retry="retry"
        />

        <GameEmptyFilters
          v-else-if="gameState === 'empty-filters'"
          @reset-filters="resetFilters"
        />

        <GameNoMoreQuestions v-else/>
      </Transition>
    </div>

    <GameTutorial
      v-if="isTutorialAvailable"
      :is-active="isTourRequested"
      @tutorial-end="endTour"
    />
  </div>
</template>