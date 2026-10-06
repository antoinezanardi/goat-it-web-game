<script lang="ts" setup>
import { ConfirmDialog } from "#components";

import type { SelectMenuItem } from "#ui/types";
import type {
  GameSettingsFilterMultiSelectEmits,
  GameSettingsFilterMultiSelectProps,
  GameSettingsFilterOptionColor,
} from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";

const props = defineProps<GameSettingsFilterMultiSelectProps>();
const emit = defineEmits<GameSettingsFilterMultiSelectEmits>();

const { t } = useI18n();
const overlay = useOverlay();

const FILTER_OPTION_ICON_CLASS_MAP: Record<GameSettingsFilterOptionColor, string> = {
  error: "text-error!",
  success: "text-success!",
  warning: "text-warning!",
};

const selectedValues = ref<string[]>([]);

const items = computed<SelectMenuItem[]>(() => props.options.map(option => ({
  ...option.color ? { ui: { itemLeadingIcon: FILTER_OPTION_ICON_CLASS_MAP[option.color] } } : {},
  icon: option.icon,
  label: option.label,
  value: option.value,
})));

const searchInputProps = computed(() => ({ placeholder: t("game.settings.filters.searchPlaceholder") }));

const summaryLabel = computed<string>(() => {
  if (selectedValues.value.length === props.options.length) {
    return props.allSelectedLabel;
  }
  if (props.summaryMode === "count") {
    return t("game.settings.filters.selectedCount", { count: selectedValues.value.length });
  }
  const labels = props.options
    .filter(option => selectedValues.value.includes(option.value))
    .map(option => option.label);
  if (labels.length <= 1) {
    return labels.join("");
  }
  const lastLabel = labels.slice(-1).join("");

  return `${labels.slice(0, -1).join(", ")} ${t("common.listConjunction")} ${lastLabel}`;
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
      description: t("game.settings.filters.confirmRestoreDescription"),
      disableShortcuts: true,
      dismissible: false,
      icon: "i-lucide-list-checks",
      iconClass: "text-warning",
      primaryButtonIcon: "i-lucide-list-restart",
      primaryButtonLabel: t("game.settings.filters.confirmRestoreAction"),
      title: t("game.settings.filters.confirmRestoreTitle"),
    },
  });
  const shouldRestoreAll = await modal.open();
  const restoredValues = shouldRestoreAll ? props.options.map(option => option.value) : [...props.modelValue];
  applySelectedValues(restoredValues);
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
      <UIcon
        v-if="props.labelIcon"
        class="shrink-0 size-5"
        data-testid="game-settings-filter-multi-select-label-icon"
        :name="props.labelIcon"
      />
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