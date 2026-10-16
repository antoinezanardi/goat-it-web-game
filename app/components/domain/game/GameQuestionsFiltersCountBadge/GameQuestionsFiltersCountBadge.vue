<script lang="ts" setup>
import { UBadge } from "#components";

import type { GameQuestionsFiltersCountBadgeProps } from "@/components/domain/game/GameQuestionsFiltersCountBadge/game-questions-filters-count-badge.types";

const props = withDefaults(defineProps<GameQuestionsFiltersCountBadgeProps>(), {
  displayMode: "count",
});

defineOptions({ inheritAttrs: false });

const { t } = useI18n();

const accessibleLabel = computed<string>(() => t("game.questionsFilters.appliedCount", { count: props.count }));

const displayedLabel = computed<string>(() => (props.displayMode === "full" ? accessibleLabel.value : props.count.toString()));

const badgeClass = computed<string>(() => (props.displayMode === "full" ? "justify-center rounded-full" : "h-5 justify-center min-w-5 rounded-full"));
</script>

<template>
  <UBadge
    v-bind="$attrs"
    :aria-label="accessibleLabel"
    :class="badgeClass"
    color="primary"
    size="sm"
    variant="solid"
  >
    {{ displayedLabel }}
  </UBadge>
</template>