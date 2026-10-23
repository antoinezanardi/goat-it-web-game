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
  gsapPromise ??= importGsap();

  return gsapPromise;
}

function useGsap(): UseGsapReturn {
  return { loadGsap };
}

export { useGsap };