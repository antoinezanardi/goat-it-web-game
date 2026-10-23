import { promiseTimeout, usePreferredReducedMotion } from "@vueuse/core";

import {
  QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
  QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES,
  QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
} from "@/composables/domain/useQuestionCardHighlight/use-question-card-highlight.constants";
import type { QuestionCardHighlightPlayable, UseQuestionCardHighlightReturn } from "@/composables/domain/useQuestionCardHighlight/use-question-card-highlight.types";

async function playSequence(
  targets: (QuestionCardHighlightPlayable | undefined | null)[],
  options: { gapMs?: number } = {},
): Promise<void> {
  const { gapMs = 0 } = options;
  const playableTargets = targets.filter((target): target is QuestionCardHighlightPlayable => target !== undefined && target !== null);

  await playableTargets.reduce<Promise<void>>(async(previousPlay, target, index) => {
    await previousPlay;
    await target.playHighlight();

    if (index < playableTargets.length - 1) {
      await promiseTimeout(gapMs);
    }
  }, Promise.resolve());
}

function readRestingScale(element: HTMLElement): number {
  const rawScale = getComputedStyle(element).scale;
  const scale = rawScale ? Number(rawScale) : Number.NaN;

  return Number.isNaN(scale) ? 1 : scale;
}

function useQuestionCardHighlight(): UseQuestionCardHighlightReturn {
  const { loadGsap } = useGsap();
  const reducedMotion = usePreferredReducedMotion();

  async function animate(elements: HTMLElement[]): Promise<void> {
    if (reducedMotion.value === "reduce") {
      return;
    }
    if (elements.length === 0) {
      return;
    }
    const restingScales = elements.map(readRestingScale);
    const [popKeyframe, settleKeyframe, restKeyframe] = QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES;
    const gsap = await loadGsap();

    await gsap.set(elements, { filter: "brightness(1)" });
    await gsap.timeline().to(
      elements,
      {
        duration: QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
        keyframes: [
          { ...popKeyframe },
          { ...settleKeyframe },
          { ...restKeyframe, scale: (index: number): number => restingScales[index] ?? 1 },
        ],
        stagger: QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
      },
      0,
    );
    await gsap.set(elements, { clearProps: "transform,filter" });
  }
  return {
    animate,
    playSequence,
  };
}

export { useQuestionCardHighlight };