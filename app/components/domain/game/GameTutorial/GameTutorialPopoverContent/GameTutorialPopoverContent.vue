<script lang="ts" setup>
import type { GameTutorialPopoverContentEmits, GameTutorialPopoverContentProps } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.types";
import { GAME_TUTORIAL_CONTROL_ICONS } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.constants";

const props = defineProps<GameTutorialPopoverContentProps>();
const emit = defineEmits<GameTutorialPopoverContentEmits>();
const { t } = useI18n();

function onBack(): void {
  emit("back");
}

function onFinish(): void {
  emit("finish");
}

function onNext(): void {
  emit("next");
}

function onSkip(): void {
  emit("skip");
}
</script>

<template>
  <div
    class="flex flex-col gap-4 max-w-[min(28rem,calc(100vw-2rem))] overflow-y-auto p-4"
    data-testid="game-tutorial"
    :style="{ 'maxHeight': props.maxHeight }"
  >
    <div class="flex gap-2 items-center min-w-0">
      <UIcon
        v-if="props.icon"
        class="shrink-0 size-5 text-primary"
        :name="props.icon"
      />

      <h2
        class="font-semibold text-fg-primary"
        data-testid="game-tutorial-title"
      >
        {{ props.title }}
      </h2>
    </div>

    <USeparator/>

    <p
      class="text-muted text-sm"
      data-testid="game-tutorial-description"
    >
      {{ props.description }}
    </p>

    <USeparator/>

    <div class="flex gap-2 items-center justify-end">
      <UButton
        v-if="props.hasNext"
        class="mr-auto"
        color="neutral"
        data-testid="game-tutorial-skip"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.skip"
        size="xs"
        variant="outline"
        @click="onSkip"
      >
        {{ t("game.interactiveTutorial.controls.skip") }}
      </UButton>

      <UButton
        v-if="props.hasPrev"
        key="u-button-2"
        :aria-label="t('game.interactiveTutorial.controls.back')"
        color="neutral"
        data-testid="game-tutorial-back"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.back"
        square
        variant="soft"
        @click="onBack"
      />

      <UButton
        v-if="props.hasNext"
        key="u-button-2"
        data-testid="game-tutorial-next"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.next"
        @click="onNext"
      >
        {{ t("game.interactiveTutorial.controls.next") }}
      </UButton>

      <UButton
        v-else
        key="u-button-3"
        data-testid="game-tutorial-finish"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.finish"
        @click="onFinish"
      >
        {{ t("game.interactiveTutorial.controls.finish") }}
      </UButton>
    </div>
  </div>
</template>