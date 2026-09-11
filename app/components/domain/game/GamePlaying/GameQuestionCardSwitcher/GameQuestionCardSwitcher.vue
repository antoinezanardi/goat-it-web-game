<script lang="ts" setup>
import { usePreferredReducedMotion } from "@vueuse/core";
import { nextTick, ref, shallowRef, toRef, watch } from "vue";

import { GameQuestionCard } from "#components";

import { CARD_TRANSITION_DURATION_SECONDS, CARD_TRANSITION_ROTATION_DEGREES, CARD_TRANSITION_SLIDE_PERCENT } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.constants";
import type { GameQuestionCardSwitcherDirection, GameQuestionCardSwitcherEmits, GameQuestionCardSwitcherProps } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";
import type { GsapContext } from "@/composables/core/gsap/gsap.types";
import { useQuestionCardRing } from "~/composables/domain/useQuestionCardRing/useQuestionCardRing";

const props = defineProps<GameQuestionCardSwitcherProps>();
const emit = defineEmits<GameQuestionCardSwitcherEmits>();

const gsap = useGSAP();
const reducedMotion = usePreferredReducedMotion();

const cardContainerReferences = ref<HTMLElement[]>([]);
const gsapContext = shallowRef<GsapContext>();
const timeline = shallowRef<ReturnType<typeof gsap.timeline>>();

const { complete: completeRing, currentSlotIndex, getSlotIndexForOffset, slots: ringSlots } = useQuestionCardRing({
  currentIndex: toRef(props, "currentIndex"),
  pendingDirection: toRef(props, "pendingDirection"),
  questions: toRef(props, "questions"),
  onResetSlot: slotIndex => {
    const element = cardContainerReferences.value[slotIndex] as HTMLElement;
    gsap.set(element, { opacity: 0, rotation: 0, xPercent: 0, zIndex: 0 });
  },
  onStaged: () => {
    emit("staged");
  },
});

function applyRestingState(): void {
  for (const [index, element] of cardContainerReferences.value.entries()) {
    const isActive = index === currentSlotIndex.value;
    gsap.set(element as HTMLElement, { opacity: isActive ? 1 : 0, rotation: 0, xPercent: 0, zIndex: isActive ? 1 : 0 });
  }
}

function startSlide(direction: GameQuestionCardSwitcherDirection): void {
  const isForward = direction === "forward";
  const leavingIndex = currentSlotIndex.value;
  const enteringIndex = getSlotIndexForOffset(isForward ? 1 : -1);
  const leavingElement = cardContainerReferences.value[leavingIndex] as HTMLElement;
  const enteringElement = cardContainerReferences.value[enteringIndex] as HTMLElement;

  const duration = reducedMotion.value === "reduce" ? 0 : CARD_TRANSITION_DURATION_SECONDS;
  const enterXPercent = isForward ? CARD_TRANSITION_SLIDE_PERCENT : -CARD_TRANSITION_SLIDE_PERCENT;
  const enterRotation = isForward ? CARD_TRANSITION_ROTATION_DEGREES : -CARD_TRANSITION_ROTATION_DEGREES;
  const leaveXPercent = isForward ? -CARD_TRANSITION_SLIDE_PERCENT : CARD_TRANSITION_SLIDE_PERCENT;
  const leaveRotation = isForward ? -CARD_TRANSITION_ROTATION_DEGREES : CARD_TRANSITION_ROTATION_DEGREES;

  gsap.set(enteringElement, { opacity: 0, rotation: enterRotation, xPercent: enterXPercent, zIndex: 2 });
  gsap.set(leavingElement, { opacity: 1, rotation: 0, xPercent: 0, zIndex: 1 });

  timeline.value?.clear();
  timeline.value?.eventCallback("onComplete", () => {
    onSlideComplete(direction);
  });
  timeline.value?.to(leavingElement, { duration, ease: "expo.out", opacity: 0, rotation: leaveRotation, xPercent: leaveXPercent }, 0);
  timeline.value?.to(enteringElement, { duration, ease: "expo.out", opacity: 1, rotation: 0, xPercent: 0 }, 0);
  timeline.value?.restart();
}

function onSlideComplete(direction: GameQuestionCardSwitcherDirection): void {
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

onMounted(() => {
  gsapContext.value = gsap.context(() => {
    timeline.value = gsap.timeline({ paused: true });
    applyRestingState();
  });
});

onUnmounted(() => {
  gsapContext.value?.revert();
});
</script>

<template>
  <div class="h-[calc(100dvh-10rem)] max-w-3xl md:max-h-[650px] mx-auto relative">
    <div
      v-for="(slot, index) in ringSlots"
      :key="index"
      :ref="(element: HTMLElement | null) => {
        if (element) cardContainerReferences[index] = element;
      }"
      :aria-hidden="slot.ariaHidden"
      class="absolute inset-0 will-change-transform"
      :inert="slot.inert || undefined"
    >
      <GameQuestionCard
        v-if="slot.question"
        :active="slot.isActive"
        :frozen="slot.isFrozen"
        :question="slot.question"
      />
    </div>
  </div>
</template>