<script lang="ts" setup>
import { UBadge } from "#components";

import { QUESTION_ADULT_CONTENT_ICON } from "~/composables/domain/question/constants/question.constants";
import { resolveHTMLElement } from "#shared/utils/helpers/element/element.dom.helpers";

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

defineExpose({
  playHighlight,
});
</script>

<template>
  <UPopover
    enable-touch
    mode="hover"
    :portal="false"
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