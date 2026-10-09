<script lang="ts" setup>
import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import type {
  GameQuestionsFiltersThemeFilterEmits,
  GameQuestionsFiltersThemeFilterProps,
} from "@/components/domain/game/GameQuestionsFiltersModalContent/GameQuestionsFiltersThemeFilter/game-questions-filters-theme-filter.types";
import { getThemeIcon, normalizeThemeSelection } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionsFiltersThemeFilterProps>();
const emit = defineEmits<GameQuestionsFiltersThemeFilterEmits>();
const { t } = useI18n();
const questionThemesStore = useQuestionThemesStore();

const activeThemes = computed<QuestionTheme[]>(() => questionThemesStore.activeQuestionThemes);
const isCatalogAvailable = computed<boolean>(() => activeThemes.value.length > 0);

const activeThemeIds = computed<string[]>(() => activeThemes.value.map(theme => theme.id));
const selectedThemeIds = computed<string[]>(() => normalizeThemeSelection(props.modelValue, activeThemeIds.value));

const options = computed<GameSettingsFilterOption[]>(() => activeThemes.value.map(theme => ({
  icon: getThemeIcon(theme.slug),
  label: theme.label,
  value: theme.id,
})));

const unavailableStatusLabel = computed<string>(() => (
  questionThemesStore.catalogStatus === "loading" ? t("game.questionsFilters.themes.loading") : t("game.questionsFilters.themes.unavailable")
));

function onUpdateSelectedThemes(values: string[]): void {
  emit("update:modelValue", activeThemeIds.value.filter(themeId => values.includes(themeId)));
}
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-testid="game-questions-filters-theme-filter"
  >
    <GameSettingsFilterMultiSelect
      v-if="isCatalogAvailable"
      :all-selected-label="t('game.questionsFilters.themes.allSelected')"
      data-testid="game-questions-filters-theme-filter-select"
      :label="t('game.questionsFilters.themes.label')"
      label-icon="i-lucide-palette"
      :model-value="selectedThemeIds"
      :options="options"
      select-test-id="game-questions-filters-theme-filter-input"
      summary-mode="count"
      summary-test-id="game-questions-filters-theme-filter-summary"
      @update:model-value="onUpdateSelectedThemes"
    />

    <div
      v-else
      class="flex gap-2 items-center text-fg-muted text-sm"
      data-testid="game-questions-filters-theme-filter-status"
    >
      <UIcon
        class="shrink-0 size-5"
        data-testid="game-questions-filters-theme-filter-status-icon"
        name="i-lucide-loader-circle"
      />
      {{ unavailableStatusLabel }}
    </div>

    <span
      v-if="isCatalogAvailable && questionThemesStore.catalogStatus === 'stale'"
      class="text-error text-sm"
      data-testid="game-questions-filters-theme-filter-refresh-error"
    >
      {{ t("game.questionsFilters.themes.refreshFailed") }}
    </span>
  </div>
</template>