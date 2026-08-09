import type { Mock } from "vitest";
import { vi } from "vitest";

import type { GsapContextSignature, GsapSetSignature, GsapTimelineSignature, GsapTimelineToSignature } from "./useGsap.mock.types";

type UseGSAPMock = {
  capturedOnComplete: { current: (() => void) | undefined };
  context: Mock<GsapContextSignature>;
  revert: Mock<() => void>;
  set: Mock<GsapSetSignature>;
  timeline: Mock<GsapTimelineSignature>;
  timelineTo: Mock<GsapTimelineToSignature>;
};

function createUseGSAPMock(): UseGSAPMock {
  const capturedOnComplete: { current: (() => void) | undefined } = { current: undefined };
  const timelineTo: Mock<GsapTimelineToSignature> = vi.fn<GsapTimelineToSignature>(() => ({ to: timelineTo }));
  const timeline: Mock<GsapTimelineSignature> = vi.fn<GsapTimelineSignature>(config => {
    if (config.onComplete) {
      capturedOnComplete.current = config.onComplete;
    }
    return { to: timelineTo };
  });
  const set: Mock<GsapSetSignature> = vi.fn<GsapSetSignature>();
  const revert: Mock<() => void> = vi.fn<() => void>();
  // Acceptable as gsap.context requires the callback pattern
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  const context: Mock<GsapContextSignature> = vi.fn<GsapContextSignature>(callback => {
    // Acceptable as gsap.context invokes the callback synchronously
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    callback();

    return { revert };
  });

  return { capturedOnComplete, context, revert, set, timeline, timelineTo };
}

export { createUseGSAPMock };

export type { UseGSAPMock };