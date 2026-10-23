import type { UseGsapReturn } from "@/composables/core/useGsap/use-gsap.types";
import type { GsapInstance } from "@/utils/ui/gsap/gsap.types";

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

function useGsap(): UseGsapReturn {
  return { loadGsap };
}

export { useGsap };