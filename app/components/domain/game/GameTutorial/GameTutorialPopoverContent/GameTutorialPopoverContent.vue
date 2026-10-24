<script lang="ts" setup>
import type { GameTutorialPopoverContentEmits, GameTutorialPopoverContentProps } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.types";
import { GAME_TUTORIAL_CONTROL_ICONS, GAME_TUTORIAL_SKIP_SHORTCUT } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.constants";
import { GAME_ARROW_SHORTCUT_KBDS, GAME_ARROW_SHORTCUTS, GAME_SHORTCUT_TOOLTIP_KBD_UI } from "@/utils/ui/game/game-shortcuts.constants";

const props = defineProps<GameTutorialPopoverContentProps>();
const emit = defineEmits<GameTutorialPopoverContentEmits>();
const { t } = useI18n();

const backwardShortcut = GAME_ARROW_SHORTCUTS.backward;
const forwardShortcut = GAME_ARROW_SHORTCUTS.forward;

const previousStepLabel = computed<string>(() => t("game.interactiveTutorial.controls.back"));
const nextStepLabel = computed<string>(() => t("game.interactiveTutorial.controls.next"));
const finishTutorialLabel = computed<string>(() => t("game.interactiveTutorial.controls.finish"));

function onGoToPreviousStep(): void {
  emit("goToPreviousStep");
}

function onFinishTutorial(): void {
  emit("finishTutorial");
}

function onGoToNextStep(): void {
  emit("goToNextStep");
}

function onSkipTutorial(): void {
  emit("skipTutorial");
}
</script>

<template>
  <div
    class="flex flex-col gap-4 max-w-[min(28rem,calc(100vw-2rem))] overflow-y-auto p-4"
    data-testid="game-tutorial"
    :style="{ 'maxHeight': props.popoverMaxHeight }"
  >
    <div class="flex gap-2 items-center min-w-0">
      <UIcon
        v-if="props.stepIcon"
        class="shrink-0 size-5 text-primary"
        :name="props.stepIcon"
      />

      <h2
        class="font-semibold text-fg-primary"
        data-testid="game-tutorial-title"
      >
        {{ props.stepTitle }}
      </h2>
    </div>

    <USeparator/>

    <p
      class="text-muted text-sm"
      data-testid="game-tutorial-description"
    >
      {{ props.stepDescription }}
    </p>

    <USeparator/>

    <div class="flex gap-2 items-center justify-end">
      <UButton
        v-if="props.hasNextStep"
        :aria-keyshortcuts="GAME_TUTORIAL_SKIP_SHORTCUT.ariaKeyshortcuts"
        class="mr-auto"
        color="neutral"
        data-testid="game-tutorial-skip"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.skip"
        size="xs"
        variant="outline"
        @click="onSkipTutorial"
      >
        {{ t("game.interactiveTutorial.controls.skip") }}

        <template #trailing>
          <UKbd
            aria-hidden="true"
            class="hidden pointer-fine:inline-flex"
            data-testid="game-tutorial-skip-shortcut"
            size="sm"
            :value="GAME_TUTORIAL_SKIP_SHORTCUT.kbd"
          />
        </template>
      </UButton>

      <UTooltip
        v-if="props.hasPreviousStep"
        :kbds="GAME_ARROW_SHORTCUT_KBDS.backward"
        :text="previousStepLabel"
        :ui="GAME_SHORTCUT_TOOLTIP_KBD_UI"
      >
        <UButton
          key="game-tutorial-back"
          :aria-keyshortcuts="backwardShortcut.ariaKeyshortcuts"
          :aria-label="previousStepLabel"
          color="neutral"
          data-testid="game-tutorial-back"
          :icon="GAME_TUTORIAL_CONTROL_ICONS.back"
          square
          variant="soft"
          @click="onGoToPreviousStep"
        />
      </UTooltip>

      <UButton
        v-if="props.hasNextStep"
        key="game-tutorial-next"
        :aria-keyshortcuts="forwardShortcut.ariaKeyshortcuts"
        data-testid="game-tutorial-next"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.next"
        @click="onGoToNextStep"
      >
        {{ nextStepLabel }}
      </UButton>

      <UButton
        v-else
        key="game-tutorial-finish"
        :aria-keyshortcuts="forwardShortcut.ariaKeyshortcuts"
        data-testid="game-tutorial-finish"
        :icon="GAME_TUTORIAL_CONTROL_ICONS.finish"
        @click="onFinishTutorial"
      >
        {{ finishTutorialLabel }}
      </UButton>
    </div>
  </div>
</template>