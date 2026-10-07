<script lang="ts" setup>
import { UBadge } from "#components";

import type { GameQuestionsFiltersCountBadgeProps } from "@/components/domain/game/GameQuestionsFiltersCountBadge/game-questions-filters-count-badge.types";

const props = defineProps<GameQuestionsFiltersCountBadgeProps>();

defineOptions({ inheritAttrs: false });

const { t } = useI18n();

const accessibleLabel = computed<string>(() => t("game.questionsFilters.appliedCount", { count: props.count }));
</script>

<template>
  <UBadge
    v-bind="$attrs"
    :aria-label="accessibleLabel"
    class="h-5 justify-center min-w-5 rounded-full"
    color="primary"
    size="sm"
    variant="solid"
  >
    {{ count }}
  </UBadge>
</template>