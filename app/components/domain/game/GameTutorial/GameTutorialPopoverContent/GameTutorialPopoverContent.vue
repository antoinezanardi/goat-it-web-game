<script lang="ts" setup>
import type { GameTutorialPopoverContentEmits, GameTutorialPopoverContentProps } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.types";
import { GAME_TUTORIAL_CONTROL_ICONS } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.constants";
import { GAME_ARROW_SHORTCUT_KBDS, GAME_ARROW_SHORTCUTS, GAME_SHORTCUT_TOOLTIP_KBD_UI } from "@/utils/ui/game/game-shortcuts.constants";

const props = defineProps<GameTutorialPopoverContentProps>();
const emit = defineEmits<GameTutorialPopoverContentEmits>();
const { t } = useI18n();

const backwardShortcut = GAME_ARROW_SHORTCUTS.backward;
const forwardShortcut = GAME_ARROW_SHORTCUTS.forward;

const backLabel = computed<string>(() => t("game.interactiveTutorial.controls.back"));
const nextLabel = computed<string>(() => t("game.interactiveTutorial.controls.next"));
const finishLabel = computed<string>(() => t("game.interactiveTutorial.controls.finish"));

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

      <UTooltip
        v-if="props.hasPrev"
        :kbds="GAME_ARROW_SHORTCUT_KBDS.backward"
        :text="backLabel"
        :ui="GAME_SHORTCUT_TOOLTIP_KBD_UI"
      >
        <UButton
          key="game-tutorial-back"
          :aria-keyshortcuts="backwardShortcut.ariaKeyshortcuts"
          :aria-label="backLabel"
          color="neutral"
          data-testid="game-tutorial-back"
          :icon="GAME_TUTORIAL_CONTROL_ICONS.back"
          square
          variant="soft"
          @click="onBack"
        />
      </UTooltip>

      <UTooltip
        v-if="props.hasNext"
        key="game-tutorial-next-tooltip"
        :kbds="GAME_ARROW_SHORTCUT_KBDS.forward"
        :text="nextLabel"
        :ui="GAME_SHORTCUT_TOOLTIP_KBD_UI"
      >
        <UButton
          key="game-tutorial-next"
          :aria-keyshortcuts="forwardShortcut.ariaKeyshortcuts"
          data-testid="game-tutorial-next"
          :icon="GAME_TUTORIAL_CONTROL_ICONS.next"
          @click="onNext"
        >
          {{ nextLabel }}
        </UButton>
      </UTooltip>

      <UTooltip
        v-if="!props.hasNext"
        key="game-tutorial-finish-tooltip"
        :kbds="GAME_ARROW_SHORTCUT_KBDS.forward"
        :text="finishLabel"
        :ui="GAME_SHORTCUT_TOOLTIP_KBD_UI"
      >
        <UButton
          key="game-tutorial-finish"
          :aria-keyshortcuts="forwardShortcut.ariaKeyshortcuts"
          data-testid="game-tutorial-finish"
          :icon="GAME_TUTORIAL_CONTROL_ICONS.finish"
          @click="onFinish"
        >
          {{ finishLabel }}
        </UButton>
      </UTooltip>
    </div>
  </div>
</template>