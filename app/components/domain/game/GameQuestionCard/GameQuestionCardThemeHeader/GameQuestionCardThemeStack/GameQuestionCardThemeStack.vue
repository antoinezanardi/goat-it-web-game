<script lang="ts" setup>
import type { GameQuestionCardThemeStackProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/game-question-card-theme-stack.types";
import type { QuestionThemeAssignment } from "#shared/types/question.types";
import type { GameQuestionCardThemeIconSize } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeIcon/game-question-card-theme-icon.types";

const props = defineProps<GameQuestionCardThemeStackProps>();

const isPopoverOpen = ref(false);

const orderedAssignments = computed<QuestionThemeAssignment[]>(() => {
  const secondary = props.question.themes.filter(assignment => !assignment.isPrimary);
  const primary = props.question.themes.find(assignment => assignment.isPrimary);

  return primary === undefined ? secondary : [...secondary, primary];
});

const isInteractive = computed<boolean>(() => props.question.themes.length > 1);

function toggleOpen(): void {
  if (!isInteractive.value) {
    return;
  }
  isPopoverOpen.value = !isPopoverOpen.value;
}

function resolveIconContainerClass(assignment: QuestionThemeAssignment): string {
  return assignment.isPrimary ? "z-10" : "-rotate-6 scale-85";
}

function resolveIconSize(assignment: QuestionThemeAssignment): GameQuestionCardThemeIconSize {
  return assignment.isPrimary ? "md" : "sm";
}

defineExpose({
  toggleOpen,
});
</script>

<template>
  <UPopover
    v-model:open="isPopoverOpen"
    mode="click"
  >
    <button
      class="-space-x-4 cursor-pointer disabled:cursor-default flex items-center"
      data-testid="theme-stack-trigger"
      :disabled="!isInteractive"
      type="button"
    >
      <GameQuestionCardThemeIcon
        v-for="assignment in orderedAssignments"
        :key="assignment.theme.slug"
        :class="resolveIconContainerClass(assignment)"
        :data-testid="`theme-stack-icon-${assignment.theme.slug}`"
        :is-hint="assignment.isHint"
        :size="resolveIconSize(assignment)"
        :theme="assignment.theme"
      />
    </button>

    <template #content>
      <GameQuestionCardThemeStackPopoverContent :themes="props.question.themes"/>
    </template>
  </UPopover>
</template>