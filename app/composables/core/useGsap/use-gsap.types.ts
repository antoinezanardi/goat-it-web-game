import type { GsapInstance } from "@/utils/ui/gsap/gsap.types";

type UseGsapReturn = {
  loadGsap: () => Promise<GsapInstance>;
};

export type { UseGsapReturn };