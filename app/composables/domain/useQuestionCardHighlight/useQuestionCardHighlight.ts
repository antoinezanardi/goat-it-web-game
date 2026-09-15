import { promiseTimeout, usePreferredReducedMotion } from "@vueuse/core";

import {
  QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
  QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES,
  QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
} from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.constants";
import type { QuestionCardHighlightPlayable, UseQuestionCardHighlightReturn } from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.types";

async function playSequence(
  targets: (QuestionCardHighlightPlayable | undefined | null)[],
  options: { gapMs?: number } = {},
): Promise<void> {
  const { gapMs = 0 } = options;
  const playableTargets = targets.filter((target): target is QuestionCardHighlightPlayable => target !== undefined && target !== null);

  for (const [index, target] of playableTargets.entries()) {
    // Acceptable as sequential await is intentional — playSequence must run targets one after another
    // oxlint-disable-next-line eslint/no-await-in-loop
    await target.playHighlight();

    if (index < playableTargets.length - 1) {
      // Acceptable as the gap delay must resolve sequentially between targets
      // oxlint-disable-next-line eslint/no-await-in-loop
      await promiseTimeout(gapMs);
    }
  }
}

function readRestingScale(element: HTMLElement): number {
  const rawScale = getComputedStyle(element).scale;
  const scale = rawScale ? Number(rawScale) : Number.NaN;

  return Number.isNaN(scale) ? 1 : scale;
}

function useQuestionCardHighlight(): UseQuestionCardHighlightReturn {
  const gsap = useGSAP();
  const reducedMotion = usePreferredReducedMotion();

  async function animate(elements: HTMLElement[]): Promise<void> {
    if (reducedMotion.value === "reduce") {
      return;
    }
    const restingScales = elements.map(readRestingScale);
    const [popKeyframe, settleKeyframe, restKeyframe] = QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES;

    gsap.set(elements, { filter: "brightness(1)" });
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
    gsap.set(elements, { clearProps: "transform,filter" });
  }
  return {
    animate,
    playSequence,
  };
}

export { useQuestionCardHighlight };