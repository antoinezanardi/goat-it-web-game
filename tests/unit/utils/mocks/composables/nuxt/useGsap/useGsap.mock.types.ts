import type { Mock } from "vitest";

type GsapSetSignature = (element: HTMLElement, variables: Record<string, number>) => void;

type GsapTimelineToSignature = (target: HTMLElement, variables: Record<string, number | string>, position: number) => { to: Mock };

type GsapTimelineSignature = (config: { onComplete?: () => void }) => { to: Mock };

type GsapContextSignature = (callback: () => void) => { revert: Mock };

export type { GsapContextSignature, GsapSetSignature, GsapTimelineSignature, GsapTimelineToSignature };