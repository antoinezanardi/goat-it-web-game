import type { UseGsapReturn } from "@/composables/core/useGsap/use-gsap.types";
import type { GsapInstance } from "@/utils/ui/gsap/gsap.types";

// Acceptable as the cached promise is assigned on first load before it is read
// oxlint-disable-next-line typescript/init-declarations
let gsapPromise: Promise<GsapInstance> | undefined;

async function importGsap(): Promise<GsapInstance> {
  const gsapModule = await import("gsap");

  return gsapModule.gsap;
}

async function loadGsap(): Promise<GsapInstance> {
  try {
    gsapPromise ??= importGsap();

    return await gsapPromise;
  } catch(error) {
    gsapPromise = undefined;
    throw error;
  }
}

/**
 * Lazily loads the GSAP core instance so animation code stays out of the initial bundle.
 *
 * The first call dynamically imports `gsap` and caches the promise, so later calls
 * share one import. A failed import clears the cache and rethrows, allowing a
 * subsequent call to retry.
 */
function useGsap(): UseGsapReturn {
  return { loadGsap };
}

export { useGsap };