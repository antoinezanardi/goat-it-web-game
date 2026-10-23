<script lang="ts" setup>
import { usePreferredReducedMotion } from "@vueuse/core";
import { nextTick, ref, shallowRef, toRef, watch } from "vue";
import type { ComponentPublicInstance } from "vue";

import { GameQuestionCard } from "#components";

import { CARD_TRANSITION_DURATION_SECONDS, CARD_TRANSITION_ROTATION_DEGREES, CARD_TRANSITION_SAFETY_TIMEOUT_MS, CARD_TRANSITION_SLIDE_PERCENT } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.constants";
import type { GameQuestionCardSwitcherEmits, GameQuestionCardSwitcherProps } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";
import type { GameNavigationDirection } from "@/utils/domain/game/game-navigation.types";
import type { GsapContext, GsapInstance, GsapTimeline } from "@/utils/ui/gsap/gsap.types";
import { resolveHTMLElement } from "@/utils/core/element/element.dom.helpers";
import { useQuestionCardRing } from "@/composables/domain/useQuestionCardRing/useQuestionCardRing";

const props = defineProps<GameQuestionCardSwitcherProps>();
const emit = defineEmits<GameQuestionCardSwitcherEmits>();

const { loadGsap } = useGsap();
const reducedMotion = usePreferredReducedMotion();

const cardContainerReferences = shallowRef<(HTMLElement | undefined)[]>([]);
const gsapContext = shallowRef<GsapContext>();
const gsapInstance = shallowRef<GsapInstance>();
const timeline = shallowRef<GsapTimeline>();
const isSlideSettled = ref<boolean>(true);
let isUnmounted = false;
// Acceptable as the pending direction is only assigned inside the watcher before it is read
// oxlint-disable-next-line typescript/init-declarations
let pendingSlideDirection: GameNavigationDirection | undefined;
// Acceptable as the timeout handle is only assigned inside startSlide before it is ever read
// oxlint-disable-next-line typescript/init-declarations
let safetyTimeout: ReturnType<typeof setTimeout> | undefined;

function resetSlot(slotIndex: number): void {
  const element = cardContainerReferences.value[slotIndex];
  const gsap = gsapInstance.value;

  if (element === undefined || gsap === undefined) {
    return;
  }
  gsap.set(element, { opacity: 0, rotation: 0, xPercent: 0, zIndex: 0 });
}

const { complete: completeRing, currentSlotIndex, getSlotIndexForOffset, slots: ringSlots } = useQuestionCardRing({
  currentIndex: toRef(props, "currentIndex"),
  pendingDirection: toRef(props, "pendingDirection"),
  questions: toRef(props, "questions"),
  onResetSlot: resetSlot,
  onStaged: () => {
    emit("staged");
  },
});

function getCardContainerClass(isActive: boolean): string {
  return isActive ? "opacity-100" : "opacity-0";
}

function setCardContainerReference(element: Element | ComponentPublicInstance | null, index: number): void {
  const resolvedElement = resolveHTMLElement(element);
  if (resolvedElement) {
    cardContainerReferences.value[index] = resolvedElement;
  }
}

function applyRestingState(): void {
  const gsap = gsapInstance.value;

  if (gsap === undefined) {
    return;
  }
  for (const [index, element] of cardContainerReferences.value.entries()) {
    if (element !== undefined) {
      const isActive = index === currentSlotIndex.value;
      gsap.set(element, { opacity: isActive ? 1 : 0, rotation: 0, xPercent: 0, zIndex: isActive ? 1 : 0 });
    }
  }
}

function armSafetyTimeout(direction: GameNavigationDirection): void {
  clearTimeout(safetyTimeout);
  safetyTimeout = setTimeout(() => onSlideComplete(direction), CARD_TRANSITION_SAFETY_TIMEOUT_MS);
}

function queueSlideUntilGsapLoads(direction: GameNavigationDirection): void {
  pendingSlideDirection = direction;
  isSlideSettled.value = false;
  armSafetyTimeout(direction);
}

function startSlide(direction: GameNavigationDirection): void {
  const gsap = gsapInstance.value;

  if (gsap === undefined) {
    queueSlideUntilGsapLoads(direction);

    return;
  }
  const isForward = direction === "forward";
  const leavingElement = cardContainerReferences.value[currentSlotIndex.value];
  const enteringElement = cardContainerReferences.value[getSlotIndexForOffset(isForward ? 1 : -1)];

  if (leavingElement === undefined || enteringElement === undefined) {
    return;
  }

  const duration = reducedMotion.value === "reduce" ? 0 : CARD_TRANSITION_DURATION_SECONDS;
  const enterXPercent = isForward ? CARD_TRANSITION_SLIDE_PERCENT : -CARD_TRANSITION_SLIDE_PERCENT;
  const enterRotation = isForward ? CARD_TRANSITION_ROTATION_DEGREES : -CARD_TRANSITION_ROTATION_DEGREES;
  const leaveXPercent = isForward ? -CARD_TRANSITION_SLIDE_PERCENT : CARD_TRANSITION_SLIDE_PERCENT;
  const leaveRotation = isForward ? -CARD_TRANSITION_ROTATION_DEGREES : CARD_TRANSITION_ROTATION_DEGREES;

  gsap.set(enteringElement, { opacity: 0, rotation: enterRotation, xPercent: enterXPercent, zIndex: 2 });
  gsap.set(leavingElement, { opacity: 1, rotation: 0, xPercent: 0, zIndex: 1 });

  isSlideSettled.value = false;
  timeline.value?.clear();
  timeline.value?.eventCallback("onComplete", () => {
    onSlideComplete(direction);
  });
  timeline.value?.to(leavingElement, { duration, ease: "expo.out", opacity: 0, rotation: leaveRotation, xPercent: leaveXPercent }, 0);
  timeline.value?.to(enteringElement, { duration, ease: "expo.out", opacity: 1, rotation: 0, xPercent: 0 }, 0);
  timeline.value?.restart();

  armSafetyTimeout(direction);
}

function onSlideComplete(direction: GameNavigationDirection): void {
  if (isSlideSettled.value) {
    return;
  }
  pendingSlideDirection = undefined;
  isSlideSettled.value = true;
  clearTimeout(safetyTimeout);
  timeline.value?.pause();
  completeRing(direction);
  applyRestingState();
  emit("complete");
}

watch(() => props.pendingDirection, async direction => {
  if (direction) {
    await nextTick();
    startSlide(direction);
  }
});

onMounted(async() => {
  const gsap = await loadGsap();

  if (isUnmounted) {
    return;
  }
  gsapInstance.value = gsap;
  gsapContext.value = gsap.context(() => {
    timeline.value = gsap.timeline({ paused: true });
    applyRestingState();
  });

  if (pendingSlideDirection !== undefined) {
    const direction = pendingSlideDirection;
    pendingSlideDirection = undefined;
    startSlide(direction);
  }
});

onUnmounted(() => {
  isUnmounted = true;
  clearTimeout(safetyTimeout);
  gsapContext.value?.revert();
});
</script>

<template>
  <div class="h-[calc(100dvh-10rem)] max-w-3xl md:max-h-162.5 mx-auto relative">
    <div
      v-for="(slot, index) in ringSlots"
      :key="index"
      :ref="(element: Element | ComponentPublicInstance | null) => setCardContainerReference(element, index)"
      :aria-hidden="slot.ariaHidden"
      class="absolute inset-0"
      :class="[
        getCardContainerClass(slot.isActive),
        { 'will-change-transform': !isSlideSettled }
      ]"
      :data-testid="`game-question-slot-${index}`"
      :inert="slot.inert"
    >
      <GameQuestionCard
        v-if="slot.question"
        :is-active="slot.isActive"
        :is-frozen="slot.isFrozen"
        :question="slot.question"
      />
    </div>
  </div>
</template>