import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Ref } from "vue";
import type { ReducedMotionType } from "@vueuse/core";

import { createUsePreferredReducedMotionMock } from "~~/tests/unit/utils/mocks/composables/core/usePreferredReducedMotion/usePreferredReducedMotion.mock";
import type { UsePreferredReducedMotionMock } from "~~/tests/unit/utils/mocks/composables/core/usePreferredReducedMotion/usePreferredReducedMotion.mock";
import { createUseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";
import type { UseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";

import { useQuestionCardHighlight } from "~/composables/domain/useQuestionCardHighlight/useQuestionCardHighlight";
import {
  QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
  QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES,
  QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
} from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.constants";

let useGSAPMock: UseGSAPMock;
let usePreferredReducedMotionMock: UsePreferredReducedMotionMock;

mockNuxtImport("useGSAP", () => (): UseGSAPMock => useGSAPMock);
mockNuxtImport("usePreferredReducedMotion", () => (): Ref<ReducedMotionType> => usePreferredReducedMotionMock.preferredReducedMotionRef);

describe(useQuestionCardHighlight, () => {
  beforeEach(() => {
    useGSAPMock = createUseGSAPMock();
    usePreferredReducedMotionMock = createUsePreferredReducedMotionMock();
  });

  describe("animate", () => {
    it("should create a timeline with an onComplete callback when animating an element.", async() => {
      const { animate } = useQuestionCardHighlight();
      const element = document.createElement("div");

      const promise = animate([element]);
      useGSAPMock.capturedOnComplete.current?.();
      await promise;

      expect(useGSAPMock.timeline).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ onComplete: expect.any(Function) as () => void }));
    });

    it("should pass the element, keyframes, stagger and position to the timeline tween when animating a single element.", async() => {
      const { animate } = useQuestionCardHighlight();
      const element = document.createElement("div");

      const promise = animate([element]);
      useGSAPMock.capturedOnComplete.current?.();
      await promise;

      expect(useGSAPMock.timelineTo).toHaveBeenCalledExactlyOnceWith(
        [element],
        expect.objectContaining({
          duration: QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
          keyframes: QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES,
          stagger: QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
        }),
        0,
      );
    });

    it("should pass all elements to the timeline tween when animating multiple elements.", async() => {
      const { animate } = useQuestionCardHighlight();
      const firstElement = document.createElement("div");
      const secondElement = document.createElement("div");

      const promise = animate([firstElement, secondElement]);
      useGSAPMock.capturedOnComplete.current?.();
      await promise;

      expect(useGSAPMock.timelineTo).toHaveBeenCalledExactlyOnceWith(
        [firstElement, secondElement],
        expect.any(Object),
        0,
      );
    });

    it("should resolve the returned promise when the timeline completes.", async() => {
      const { animate } = useQuestionCardHighlight();
      const element = document.createElement("div");

      const promise = animate([element]);
      useGSAPMock.capturedOnComplete.current?.();

      await expect(promise).resolves.toBeUndefined();
    });

    it("should resolve immediately without creating a timeline when reduced motion is preferred.", async() => {
      usePreferredReducedMotionMock.preferredReducedMotionRef.value = "reduce";
      const { animate } = useQuestionCardHighlight();
      const element = document.createElement("div");

      await animate([element]);

      expect(useGSAPMock.timeline).not.toHaveBeenCalled();
    });
  });

  describe("playSequence", () => {
    it("should call each target's playHighlight in order when called.", async() => {
      vi.useFakeTimers();
      const { playSequence } = useQuestionCardHighlight();
      const calls: string[] = [];
      const firstTarget = {
        playHighlight: vi.fn<() => Promise<void>>().mockImplementation(async() => {
          await Promise.resolve();
          calls.push("first");
        }),
      };
      const secondTarget = {
        playHighlight: vi.fn<() => Promise<void>>().mockImplementation(async() => {
          await Promise.resolve();
          calls.push("second");
        }),
      };

      const promise = playSequence([firstTarget, secondTarget]);
      await vi.advanceTimersByTimeAsync(0);
      await promise;
      vi.useRealTimers();

      expect(calls).toStrictEqual(["first", "second"]);
    });

    it("should skip undefined and null targets without consuming a gap when called.", async() => {
      vi.useFakeTimers();
      const { playSequence } = useQuestionCardHighlight();
      const firstTarget = { playHighlight: vi.fn<() => Promise<void>>().mockResolvedValue(undefined) };
      const secondTarget = { playHighlight: vi.fn<() => Promise<void>>().mockResolvedValue(undefined) };

      const promise = playSequence([firstTarget, undefined, null, secondTarget], { gapMs: 100 });
      await vi.advanceTimersByTimeAsync(100);
      await promise;
      vi.useRealTimers();

      expect(secondTarget.playHighlight).toHaveBeenCalledExactlyOnceWith();
    });

    it("should use a default gapMs of 0 when called without options.", async() => {
      vi.useFakeTimers();
      const { playSequence } = useQuestionCardHighlight();
      const target = { playHighlight: vi.fn<() => Promise<void>>().mockResolvedValue(undefined) };

      const startTime = Date.now();
      const promise = playSequence([target]);
      await vi.advanceTimersByTimeAsync(0);
      await promise;
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBe(0);

      vi.useRealTimers();
    });

    it("should apply gapMs only between targets, not after the last one, when called.", async() => {
      vi.useFakeTimers();
      const { playSequence } = useQuestionCardHighlight();
      const firstTarget = { playHighlight: vi.fn<() => Promise<void>>().mockResolvedValue(undefined) };
      const secondTarget = { playHighlight: vi.fn<() => Promise<void>>().mockResolvedValue(undefined) };

      const startTime = Date.now();
      const promise = playSequence([firstTarget, secondTarget], { gapMs: 250 });
      await vi.advanceTimersByTimeAsync(250);
      await promise;
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBe(250);

      vi.useRealTimers();
    });
  });
});