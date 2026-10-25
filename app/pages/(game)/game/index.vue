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
  retryQuestionFetch,
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
const { isChangelogOpen } = useChangelogState();

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
  isFiltersModalOpen.value ||
  isChangelogOpen.value);
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
        :is-game-tutorial-available="isTutorialAvailable"
        :is-sidebar-open="isSidebarOpen"
        @after:leave="openRequestedFiltersModal"
        @open-changelog="closeSidebar"
        @open-game-filters="onOpenFiltersFromSidebar"
        @open-game-settings="onOpenSettings"
        @start-game-tutorial="startTutorialFromSidebar"
        @update:is-sidebar-open="setSidebarOpen"
      />

      <GameSettingsModal
        :is-fetching-questions="isFetchingQuestions"
        :is-open="isSettingsModalOpen"
        @update:is-open="setSettingsModalOpen"
      />

      <GameQuestionsFiltersModal
        :is-apply-filters-pending="isApplyFiltersPending"
        :is-filters-modal-open="isFiltersModalOpen"
        @apply-filters="applyFilters"
        @update:is-filters-modal-open="setFiltersModalOpen"
      />

      <GameStateRenderer
        :are-shortcuts-disabled="areShortcutsDisabled"
        :can-go-to-previous-question="canGoToPreviousQuestion"
        :current-index="currentIndex"
        :current-question="currentQuestion"
        :game-state="gameState"
        :is-translating="isTranslating"
        :questions="questions"
        @advance="advanceToNextQuestion"
        @previous="goToPreviousQuestion"
        @reset-filters="resetFilters"
        @retry="retryQuestionFetch"
      />
    </div>

    <ClientOnly v-if="isTutorialAvailable">
      <GameTutorial
        :is-active="isTourRequested"
        @tutorial-end="endTour"
      />
    </ClientOnly>
  </div>
</template>