import type { GsapInstance } from "@/utils/ui/gsap/gsap.types";

/**
 * Contract returned by `useGsap`: the cached GSAP loader.
 */
type UseGsapReturn = {
  /** Resolves the core instance; safe to call repeatedly, rejects when the import fails. */
  loadGsap: () => Promise<GsapInstance>;
};

export type { UseGsapReturn };