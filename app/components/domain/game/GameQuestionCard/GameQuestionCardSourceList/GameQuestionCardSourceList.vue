<script lang="ts" setup>
import type { GameQuestionCardSourceListProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardSourceList/game-question-card-source-list.types";
import { GAME_QUESTION_CARD_SOURCE_LINK_CLASSES } from "@/components/domain/game/GameQuestionCard/GameQuestionCardSourceList/game-question-card-source-list.constants";
import { getSourceDomain } from "~/composables/domain/question/helpers/question.helpers";

defineProps<GameQuestionCardSourceListProps>();

const { t } = useI18n();

function getSourceLinkLabel(url: string): string {
  return t("questions.sourceTooltip", { url });
}
</script>

<template>
  <nav
    :aria-label="$t('questions.sourcesAriaLabel')"
    class="flex flex-wrap gap-x-3 gap-y-2"
  >
    <span class="font-medium shrink-0 text-text-secondary text-xs">
      {{ $t("questions.sourceLabel", { "count": sourceUrls.length }) }}:
    </span>

    <UTooltip
      v-for="url in sourceUrls"
      :key="url"
      :text="getSourceLinkLabel(url)"
    >
      <ULink
        :aria-label="getSourceLinkLabel(url)"
        :class="GAME_QUESTION_CARD_SOURCE_LINK_CLASSES"
        rel="noopener noreferrer"
        target="_blank"
        :to="url"
      >
        <UIcon
          class="size-3.5"
          name="i-lucide-external-link"
        />
        {{ getSourceDomain(url) }}
      </ULink>
    </UTooltip>
  </nav>
</template>