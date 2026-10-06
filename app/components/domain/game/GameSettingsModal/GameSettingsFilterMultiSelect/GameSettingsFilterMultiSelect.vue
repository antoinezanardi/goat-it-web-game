<script lang="ts" setup>
import { ConfirmDialog } from "#components";

import type { SelectMenuItem } from "#ui/types";
import {
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ACTION_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_DESCRIPTION_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ICON,
  GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_TITLE_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_KEEP_ACTION_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_SEARCH_PLACEHOLDER_KEY,
  GAME_SETTINGS_FILTER_MULTI_SELECT_SELECTED_COUNT_KEY,
} from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.constants";
import type { GameSettingsFilterMultiSelectEmits, GameSettingsFilterMultiSelectProps } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";

const props = defineProps<GameSettingsFilterMultiSelectProps>();
const emit = defineEmits<GameSettingsFilterMultiSelectEmits>();

const { t } = useI18n();
const overlay = useOverlay();

const selectedValues = ref<string[]>([]);

const items = computed<SelectMenuItem[]>(() => props.options.map(option => ({
  icon: option.icon,
  label: option.label,
  value: option.value,
})));

const searchInputProps = computed(() => ({ placeholder: t(GAME_SETTINGS_FILTER_MULTI_SELECT_SEARCH_PLACEHOLDER_KEY) }));

const summaryLabel = computed<string>(() => {
  if (selectedValues.value.length === props.options.length) {
    return props.allSelectedLabel;
  }
  if (props.summaryMode === "count") {
    return t(GAME_SETTINGS_FILTER_MULTI_SELECT_SELECTED_COUNT_KEY, { count: selectedValues.value.length });
  }
  return props.options
    .filter(option => selectedValues.value.includes(option.value))
    .map(option => option.label)
    .join(", ");
});

watch(() => props.modelValue, (value: string[]) => {
  selectedValues.value = [...value];
}, { immediate: true });

function applySelectedValues(value: string[]): void {
  selectedValues.value = value;
  emit("update:modelValue", value);
}

async function confirmRestoreAllOptions(): Promise<void> {
  const modal = overlay.create(ConfirmDialog, {
    destroyOnClose: true,
    props: {
      closeButtonLabel: t(GAME_SETTINGS_FILTER_MULTI_SELECT_KEEP_ACTION_KEY),
      description: t(GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_DESCRIPTION_KEY),
      disableShortcuts: true,
      dismissible: false,
      icon: GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ICON,
      iconClass: "text-warning",
      primaryButtonLabel: t(GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_ACTION_KEY),
      title: t(GAME_SETTINGS_FILTER_MULTI_SELECT_CONFIRM_TITLE_KEY),
    },
  });
  const shouldRestoreAll = await modal.open();
  applySelectedValues(shouldRestoreAll ? props.options.map(option => option.value) : [...props.modelValue]);
}

function onUpdateSelectedValues(value: string[]): void {
  if (value.length > 0) {
    applySelectedValues(value);

    return;
  }
  void confirmRestoreAllOptions();
}
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-testid="game-settings-filter-multi-select"
  >
    <span
      class="flex font-medium gap-2 items-center text-fg-primary text-sm"
      data-testid="game-settings-filter-multi-select-label"
    >
      {{ props.label }}
    </span>

    <USelectMenu
      :aria-label="props.label"
      data-testid="game-settings-filter-multi-select-input"
      :items="items"
      :model-value="selectedValues"
      multiple
      :search-input="searchInputProps"
      value-key="value"
      @update:model-value="onUpdateSelectedValues"
    >
      <template #default>
        <span
          class="truncate"
          data-testid="game-settings-filter-multi-select-summary"
        >
          {{ summaryLabel }}
        </span>
      </template>
    </USelectMenu>
  </div>
</template>