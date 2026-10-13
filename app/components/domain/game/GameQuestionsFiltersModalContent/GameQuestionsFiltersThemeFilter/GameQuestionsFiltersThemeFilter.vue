<script lang="ts" setup>
import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import type {
  GameQuestionsFiltersThemeFilterEmits,
  GameQuestionsFiltersThemeFilterProps,
} from "@/components/domain/game/GameQuestionsFiltersModalContent/GameQuestionsFiltersThemeFilter/game-questions-filters-theme-filter.types";
import { getThemeIcon, resolveSelectedThemeIds, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionsFiltersThemeFilterProps>();
const emit = defineEmits<GameQuestionsFiltersThemeFilterEmits>();
const { t } = useI18n();
const questionThemesStore = useQuestionThemesStore();

const isCatalogLoading = computed<boolean>(() => questionThemesStore.catalogStatus === "loading");
const statusIconName = computed<string>(() => (isCatalogLoading.value ? "i-lucide-loader-circle" : "i-lucide-triangle-alert"));
const selectedThemeIds = computed<string[]>(() => resolveSelectedThemeIds(props.modelValue, questionThemesStore.activeQuestionThemeIds) ?? []);

const options = computed<GameSettingsFilterOption[]>(() => questionThemesStore.activeQuestionThemes.map(theme => ({
  color: resolveThemeColor(theme.color),
  icon: getThemeIcon(theme.slug),
  label: theme.label,
  value: theme.id,
})));

const unavailableStatusLabel = computed<string>(() => (
  isCatalogLoading.value ? t("game.questionsFilters.themes.loading") : t("game.questionsFilters.themes.unavailable")
));

function onUpdateSelectedThemes(values: string[]): void {
  emit("update:modelValue", questionThemesStore.activeQuestionThemeIds.filter(themeId => values.includes(themeId)));
}
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-testid="game-questions-filters-theme-filter"
  >
    <GameSettingsFilterMultiSelect
      v-if="questionThemesStore.isThemesCatalogAvailable"
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
        :class="{ 'animate-spin': isCatalogLoading }"
        data-testid="game-questions-filters-theme-filter-status-icon"
        :name="statusIconName"
      />
      {{ unavailableStatusLabel }}
    </div>

    <span
      v-if="questionThemesStore.isThemesCatalogAvailable && questionThemesStore.catalogStatus === 'stale'"
      class="text-error text-sm"
      data-testid="game-questions-filters-theme-filter-refresh-error"
    >
      {{ t("game.questionsFilters.themes.refreshFailed") }}
    </span>
  </div>
</template>