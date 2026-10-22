<script lang="ts" setup>
import { useEventListener } from "@vueuse/core";
import { nextTick } from "vue";

import { GameTutorialPopoverContent } from "#components";

import { getFocusedHTMLElement, isEditableKeyboardTarget, isElementFocusable } from "@/utils/core/element/element.dom.helpers";
import type {
  GameTutorialEmits,
  GameTutorialPopoverContentConfig,
  GameTutorialProps,
  GameTutorialSpotlightRect,
} from "@/components/domain/game/GameTutorial/game-tutorial.types";
import type { GameNavigationDirection } from "@/utils/domain/game/game-navigation.types";
import {
  GAME_TUTORIAL_ARROW_KEY_DIRECTIONS,
  GAME_TUTORIAL_POPOVER_MARGIN,
  GAME_TUTORIAL_POPOVER_MIN_HEIGHT,
  GAME_TUTORIAL_POPOVER_OFFSET,
  GAME_TUTORIAL_POPOVER_UI,
  GAME_TUTORIAL_SPOTLIGHT_PADDING,
  GAME_TUTORIAL_SPOTLIGHT_PADDING_SIDES,
  GAME_TUTORIAL_STEPS,
} from "@/components/domain/game/GameTutorial/game-tutorial.constants";

const props = defineProps<GameTutorialProps>();
const emit = defineEmits<GameTutorialEmits>();
const { t } = useI18n();

const popoverMaxHeight = ref<string>("none");
const popoverSide = ref<"bottom" | "top">("bottom");
const previouslyFocusedElement = ref<HTMLElement>();

function captureFocusOrigin(): void {
  previouslyFocusedElement.value = getFocusedHTMLElement();
}

function restoreFocus(): void {
  const origin = previouslyFocusedElement.value;

  previouslyFocusedElement.value = undefined;
  if (origin !== undefined && !origin.closest("[role='dialog']") && isElementFocusable(origin)) {
    origin.focus();

    if (document.activeElement === origin) {
      return;
    }
  }
  document.querySelector<HTMLElement>("[data-testid='game-sidebar-toggle-button']")?.focus();
}

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

const currentStepTitle = computed<string | undefined>(() => tourSteps.value[index.value]?.title);
const popoverContent = computed<GameTutorialPopoverContentConfig>(() => ({
  "side": popoverSide.value,
  "sideOffset": GAME_TUTORIAL_POPOVER_OFFSET,
  "aria-label": currentStepTitle.value,
  onEscapeKeyDown,
}));

function onEscapeKeyDown(event: KeyboardEvent): void {
  event.preventDefault();
  finish();
}

const highlightRect = ref<GameTutorialSpotlightRect>();

const spotlightStyle = computed(() => {
  const rect = highlightRect.value;

  if (rect === undefined) {
    return;
  }
  return {
    height: `${rect.height + GAME_TUTORIAL_SPOTLIGHT_PADDING * GAME_TUTORIAL_SPOTLIGHT_PADDING_SIDES}px`,
    left: `${rect.left - GAME_TUTORIAL_SPOTLIGHT_PADDING}px`,
    top: `${rect.top - GAME_TUTORIAL_SPOTLIGHT_PADDING}px`,
    width: `${rect.width + GAME_TUTORIAL_SPOTLIGHT_PADDING * GAME_TUTORIAL_SPOTLIGHT_PADDING_SIDES}px`,
  };
});

function updateTourLayout(element?: Element): void {
  if (element === undefined) {
    highlightRect.value = undefined;
    popoverMaxHeight.value = "none";
    popoverSide.value = "bottom";

    return;
  }
  const { bottom, height, left, top, width } = element.getBoundingClientRect();

  highlightRect.value = { height, left, top, width };
  const spaceAbove = top - GAME_TUTORIAL_POPOVER_MARGIN;
  const spaceBelow = window.innerHeight - bottom - GAME_TUTORIAL_POPOVER_MARGIN;
  const shouldOpenAbove = spaceAbove > spaceBelow;

  popoverSide.value = shouldOpenAbove ? "top" : "bottom";
  popoverMaxHeight.value = `${Math.max(shouldOpenAbove ? spaceAbove : spaceBelow, GAME_TUTORIAL_POPOVER_MIN_HEIGHT)}px`;
}

function updateTourTarget(): void {
  if (reference.value instanceof Element) {
    updateTourLayout(reference.value);

    return;
  }
  updateTourLayout();
}

function canNavigateTutorialStep(direction: GameNavigationDirection): boolean {
  return direction === "forward" || hasPrev.value;
}

function navigateTutorialStep(direction: GameNavigationDirection): void {
  if (direction === "forward") {
    next();

    return;
  }
  prev();
}

function onTutorialShortcut(event: KeyboardEvent): void {
  if (!open.value || event.repeat || isEditableKeyboardTarget(event.target)) {
    return;
  }
  const direction = GAME_TUTORIAL_ARROW_KEY_DIRECTIONS[event.key];

  if (direction === undefined || !canNavigateTutorialStep(direction)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  navigateTutorialStep(direction);
}

useEventListener("keydown", onTutorialShortcut, { capture: true, passive: false });

watch(() => props.isActive, isActive => {
  if (isActive) {
    captureFocusOrigin();
    start(0);

    return;
  }
  finish();
});

watch([open, index], updateTourTarget);

useEventListener("resize", () => {
  if (open.value) {
    updateTourTarget();
  }
});

useEventListener("scroll", () => {
  if (open.value) {
    updateTourTarget();
  }
}, { capture: true });

watch(open, async isOpen => {
  if (!isOpen) {
    emit("tutorialEnd");
    await nextTick();
    restoreFocus();
  }
});
</script>

<template>
  <div>
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40"
        data-testid="game-tutorial-backdrop"
      >
        <div
          v-if="spotlightStyle"
          class="absolute game-tutorial-spotlight"
          data-testid="game-tutorial-spotlight"
          :style="spotlightStyle"
        />

        <div
          v-else
          class="absolute bg-black/50 inset-0"
        />
      </div>
    </Transition>

    <UPopover
      :content="popoverContent"
      :dismissible="false"
      modal
      :open="open"
      :reference="reference"
      :ui="GAME_TUTORIAL_POPOVER_UI"
    >
      <template #content>
        <GameTutorialPopoverContent
          :key="index"
          class="game-tutorial-step-in"
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