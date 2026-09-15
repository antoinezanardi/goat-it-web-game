import type { Mock } from "vitest";
import { vi } from "vitest";

import type { GsapContextAddSignature, GsapContextSignature, GsapSetSignature, GsapTimelineInstance, GsapTimelineSignature, GsapTimelineToSignature } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock.types.ts";

type UseGSAPMock = {
  add: Mock<GsapContextAddSignature>;
  capturedOnComplete: { current: (() => void) | undefined };
  clear: Mock<() => void>;
  context: Mock<GsapContextSignature>;
  eventCallback: Mock<(type: string, callback?: (() => void) | null) => void>;
  pause: Mock<() => void>;
  restart: Mock<() => void>;
  revert: Mock<() => void>;
  set: Mock<GsapSetSignature>;
  timeline: Mock<GsapTimelineSignature>;
  timelineTo: Mock<GsapTimelineToSignature>;
};

function createTimelineMocks(): Pick<UseGSAPMock, "capturedOnComplete" | "clear" | "eventCallback" | "pause" | "restart" | "timeline" | "timelineTo"> {
  const capturedOnComplete: { current: (() => void) | undefined } = { current: undefined };
  const timelineTo: Mock<GsapTimelineToSignature> = vi.fn<GsapTimelineToSignature>(() => timelineInstance);
  const clear: Mock<() => void> = vi.fn<() => void>();
  const pause: Mock<() => void> = vi.fn<() => void>();
  const restart: Mock<() => void> = vi.fn<() => void>();
  const then: Mock<(onFulfilled?: () => void) => void> = vi.fn<(onFulfilled?: () => void) => void>(onFulfilled => {
    onFulfilled?.();
  });
  // Acceptable as gsap.eventCallback captures the onComplete callback synchronously
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  const eventCallback: Mock<(type: string, callback?: (() => void) | null) => void> = vi.fn<(type: string, callback?: (() => void) | null) => void>((type, callback) => {
    if (type === "onComplete" && callback) {
      capturedOnComplete.current = callback;
    }
  });
  // Acceptable as GSAP timelines are natively thenable and await relies on it
  // oxlint-disable-next-line unicorn/no-thenable
  const timelineInstance: GsapTimelineInstance = { clear, eventCallback, pause, restart, then, to: timelineTo };
  const timeline: Mock<GsapTimelineSignature> = vi.fn<GsapTimelineSignature>(config => {
    if (config?.onComplete) {
      capturedOnComplete.current = config.onComplete;
    }
    return timelineInstance;
  });

  return { capturedOnComplete, clear, eventCallback, pause, restart, timeline, timelineTo };
}

function createUseGSAPMock(): UseGSAPMock {
  const { capturedOnComplete, clear, eventCallback, pause, restart, timeline, timelineTo } = createTimelineMocks();
  const set: Mock<GsapSetSignature> = vi.fn<GsapSetSignature>();
  const revert: Mock<() => void> = vi.fn<() => void>();
  // Acceptable as gsap.context.add invokes the callback synchronously
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  const add: Mock<GsapContextAddSignature> = vi.fn<GsapContextAddSignature>(callback => {
    // Acceptable as gsap.context.add invokes the callback synchronously
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    callback();
  });
  // Acceptable as gsap.context requires the callback pattern
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  const context: Mock<GsapContextSignature> = vi.fn<GsapContextSignature>(callback => {
    // Acceptable as gsap.context invokes the callback synchronously
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    callback();

    return { add, revert };
  });

  return { add, capturedOnComplete, clear, context, eventCallback, pause, restart, revert, set, timeline, timelineTo };
}

export { createUseGSAPMock };

export type { UseGSAPMock };