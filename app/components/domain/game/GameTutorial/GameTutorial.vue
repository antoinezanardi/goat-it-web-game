<script lang="ts" setup>
import { GameTutorialPopoverContent } from "#components";

import type { GameTutorialEmits, GameTutorialProps } from "@/components/domain/game/GameTutorial/game-tutorial.types";
import {
  GAME_TUTORIAL_HIGHLIGHT_CLASS,
  GAME_TUTORIAL_POPOVER_MARGIN,
  GAME_TUTORIAL_POPOVER_MIN_HEIGHT,
  GAME_TUTORIAL_POPOVER_OFFSET,
  GAME_TUTORIAL_POPOVER_UI,
  GAME_TUTORIAL_STEPS,
} from "@/components/domain/game/GameTutorial/game-tutorial.constants";

const props = defineProps<GameTutorialProps>();
const emit = defineEmits<GameTutorialEmits>();
const { t } = useI18n();

const popoverMaxHeight = ref<string>("none");
const popoverSide = ref<"bottom" | "top">("bottom");
const popoverContent = computed(() => ({
  side: popoverSide.value,
  sideOffset: GAME_TUTORIAL_POPOVER_OFFSET,
}));

const tourSteps = computed(() => GAME_TUTORIAL_STEPS.map(step => {
  const { target } = step;

  return {
    icon: step.icon,
    target: target === undefined ? undefined : (): Element | null => document.querySelector(target),
    title: t(`game.interactiveTutorial.steps.${step.key}.title`),
    description: t(`game.interactiveTutorial.steps.${step.key}.description`),
  };
}));

const {
  current,
  finish,
  hasNext,
  hasPrev,
  index,
  open,
  next,
  prev,
  reference,
  start,
} = useTour(tourSteps);

const highlightedElement = shallowRef<Element>();

function clearHighlight(): void {
  highlightedElement.value?.classList.remove(GAME_TUTORIAL_HIGHLIGHT_CLASS);
  highlightedElement.value = undefined;
}

function updateTourLayout(element?: Element): void {
  if (element === undefined) {
    popoverMaxHeight.value = "none";
    popoverSide.value = "bottom";

    return;
  }
  const { bottom, top } = element.getBoundingClientRect();
  const spaceAbove = top - GAME_TUTORIAL_POPOVER_MARGIN;
  const spaceBelow = window.innerHeight - bottom - GAME_TUTORIAL_POPOVER_MARGIN;
  const shouldOpenAbove = spaceAbove > spaceBelow;

  popoverSide.value = shouldOpenAbove ? "top" : "bottom";
  popoverMaxHeight.value = `${Math.max(shouldOpenAbove ? spaceAbove : spaceBelow, GAME_TUTORIAL_POPOVER_MIN_HEIGHT)}px`;
}

function updateTourTarget(): void {
  clearHighlight();

  if (reference.value instanceof Element) {
    highlightedElement.value = reference.value;
    highlightedElement.value.classList.add(GAME_TUTORIAL_HIGHLIGHT_CLASS);
    updateTourLayout(reference.value);

    return;
  }
  updateTourLayout();
}

watch(() => props.isActive, isActive => {
  if (isActive) {
    start(0);

    return;
  }
  finish();
});

watch([open, index], updateTourTarget);

watch(open, isOpen => {
  if (!isOpen) {
    emit("tutorialEnd");
  }
});

onBeforeUnmount(() => {
  clearHighlight();
});
</script>

<template>
  <div>
    <Transition name="fade">
      <div
        v-if="open"
        class="bg-black/60 fixed inset-0 z-40"
        data-testid="game-tutorial-backdrop"
      />
    </Transition>

    <UPopover
      :content="popoverContent"
      :dismissible="false"
      :open="open"
      :reference="reference"
      :ui="GAME_TUTORIAL_POPOVER_UI"
    >
      <template #content>
        <GameTutorialPopoverContent
          :description="current?.description"
          :has-next="hasNext"
          :has-prev="hasPrev"
          :icon="current?.icon"
          :max-height="popoverMaxHeight"
          :title="current?.title"
          @back="prev"
          @finish="finish"
          @next="next"
          @skip="finish"
        />
      </template>
    </UPopover>
  </div>
</template>