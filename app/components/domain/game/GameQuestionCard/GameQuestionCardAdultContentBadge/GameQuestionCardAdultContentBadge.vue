<script lang="ts" setup>
import { UBadge } from "#components";

import type { GameQuestionCardAdultContentBadgeExposed } from "@/components/domain/game/GameQuestionCard/GameQuestionCardAdultContentBadge/game-question-card-adult-content-badge.types";
import { QUESTION_ADULT_CONTENT_ICON } from "@/utils/ui/question/question.constants";
import { resolveHTMLElement } from "@/utils/core/element/element.dom.helpers";

const { t } = useI18n();

const highlight = useQuestionCardHighlight();
const badgeElementReference = useTemplateRef<InstanceType<typeof UBadge>>("badgeElementReference");

async function playHighlight(): Promise<void> {
  const badgeElement = resolveHTMLElement(badgeElementReference.value);
  if (badgeElement === undefined) {
    return;
  }
  await highlight.animate([badgeElement]);
}

const exposed: GameQuestionCardAdultContentBadgeExposed = {
  playHighlight,
};

defineExpose(exposed);
</script>

<template>
  <UPopover
    enable-touch
    mode="hover"
    portal="main"
  >
    <UBadge
      ref="badgeElementReference"
      :aria-label="t('questions.adultContentTooltip')"
      class="p-2 ring-2 ring-secondary/50 rounded-full"
      color="secondary"
      data-testid="game-question-adult-content"
      :icon="QUESTION_ADULT_CONTENT_ICON"
      role="img"
      size="lg"
      square
      variant="subtle"
    />

    <template #content>
      <div
        class="px-3 py-2 text-sm"
        data-testid="game-question-adult-content-popover"
      >
        {{ t("questions.adultContentTooltip") }}
      </div>
    </template>
  </UPopover>
</template>