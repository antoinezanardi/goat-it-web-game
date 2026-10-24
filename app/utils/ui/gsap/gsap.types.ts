import type { gsap } from "gsap";

/**
 * Root GSAP instance, typed from the installed package.
 */
type GsapInstance = typeof gsap;

/**
 * GSAP timeline created by `gsap.timeline()`.
 */
type GsapTimeline = ReturnType<GsapInstance["timeline"]>;

/**
 * GSAP context created by `gsap.context()`.
 */
type GsapContext = ReturnType<GsapInstance["context"]>;

export type { GsapContext, GsapInstance, GsapTimeline };