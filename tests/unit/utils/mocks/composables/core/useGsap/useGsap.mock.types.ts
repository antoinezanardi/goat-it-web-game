import type { Mock } from "vitest";

type GsapSetSignature = (target: HTMLElement | HTMLElement[], variables: Record<string, number | string>) => void;

type GsapTimelineToSignature = (target: HTMLElement | HTMLElement[], variables: Record<string, unknown>, position: number) => GsapTimelineInstance;

type GsapTimelineInstance = {
  clear: Mock<() => void>;
  eventCallback: Mock<(type: string, callback?: (() => void) | null) => void>;
  pause: Mock<() => void>;
  restart: Mock<() => void>;
  then: Mock<(onFulfilled?: () => void) => void>;
  to: Mock<GsapTimelineToSignature>;
};

type GsapTimelineSignature = (config?: { onComplete?: () => void; paused?: boolean }) => GsapTimelineInstance;

type GsapContextAddSignature = (callback: () => void) => void;

type GsapContextSignature = (callback: () => void) => { add: Mock<GsapContextAddSignature>; revert: Mock };

type GsapMock = {
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

type UseGsapMock = GsapMock & {
  loadGsap: Mock<() => Promise<GsapMock>>;
};

export type { GsapContextAddSignature, GsapContextSignature, GsapMock, GsapSetSignature, GsapTimelineInstance, GsapTimelineSignature, GsapTimelineToSignature, UseGsapMock };