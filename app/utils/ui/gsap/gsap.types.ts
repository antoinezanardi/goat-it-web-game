import type { gsap } from "gsap";

type GsapInstance = typeof gsap;

type GsapTimeline = ReturnType<GsapInstance["timeline"]>;

type GsapContext = ReturnType<GsapInstance["context"]>;

export type { GsapContext, GsapInstance, GsapTimeline };