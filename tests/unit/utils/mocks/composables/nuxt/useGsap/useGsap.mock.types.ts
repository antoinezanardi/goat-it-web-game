import type { Mock } from "vitest";

type GsapSetSignature = (element: HTMLElement, variables: Record<string, number>) => void;

type GsapTimelineToSignature = (target: HTMLElement, variables: Record<string, number | string>, position: number) => GsapTimelineInstance;

type GsapTimelineInstance = {
  clear: Mock<() => void>;
  eventCallback: Mock<(type: string, callback?: (() => void) | null) => void>;
  pause: Mock<() => void>;
  restart: Mock<() => void>;
  to: Mock<GsapTimelineToSignature>;
};

type GsapTimelineSignature = (config: { onComplete?: () => void; paused?: boolean }) => GsapTimelineInstance;

type GsapContextAddSignature = (callback: () => void) => void;

type GsapContextSignature = (callback: () => void) => { add: Mock<GsapContextAddSignature>; revert: Mock };

export type { GsapContextAddSignature, GsapContextSignature, GsapSetSignature, GsapTimelineInstance, GsapTimelineSignature, GsapTimelineToSignature };