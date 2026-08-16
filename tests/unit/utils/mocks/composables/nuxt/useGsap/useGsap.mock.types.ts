import type { Mock } from "vitest";

type GsapSetSignature = (element: HTMLElement, variables: Record<string, number>) => void;

type GsapTimelineToSignature = (target: HTMLElement, variables: Record<string, number | string>, position: number) => { to: Mock };

type GsapTimelineSignature = (config: { onComplete?: () => void }) => { to: Mock };

type GsapContextAddSignature = (callback: () => void) => void;

type GsapContextSignature = (callback: () => void) => { add: Mock<GsapContextAddSignature>; revert: Mock };

export type { GsapContextAddSignature, GsapContextSignature, GsapSetSignature, GsapTimelineSignature, GsapTimelineToSignature };