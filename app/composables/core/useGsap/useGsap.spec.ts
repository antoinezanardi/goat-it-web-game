import { beforeEach, describe, expect, it, vi } from "vitest";

import type { useGsap as UseGsapType } from "@/composables/core/useGsap/useGsap";
import type { GsapInstance } from "@/utils/ui/gsap/gsap.types";

const gsapImportState = vi.hoisted(() => ({ shouldFail: false }));

vi.mock(import("gsap"), async importOriginal => {
  const actual = await importOriginal();

  return {
    get gsap(): GsapInstance {
      if (gsapImportState.shouldFail) {
        throw new Error("GSAP import failed.");
      }
      return actual.gsap;
    },
  };
});

let useGsap: typeof UseGsapType;

describe("useGsap", () => {
  beforeEach(async() => {
    gsapImportState.shouldFail = false;
    ({ useGsap } = await import("@/composables/core/useGsap/useGsap"));
  });

  it("should return a loadGsap function when called.", () => {
    expect(useGsap().loadGsap).toBeTypeOf("function");
  });

  it("should resolve with the gsap core instance when loading.", async() => {
    const { gsap } = await import("gsap");

    await expect(useGsap().loadGsap()).resolves.toBe(gsap);
  });

  it("should resolve with the same gsap instance when loading multiple times.", async() => {
    const firstGsap = await useGsap().loadGsap();
    const secondGsap = await useGsap().loadGsap();

    expect(secondGsap).toBe(firstGsap);
  });

  it("should retry loading gsap after a failed import when loading again.", async() => {
    vi.resetModules();
    gsapImportState.shouldFail = true;
    const { useGsap: freshUseGsap } = await import("@/composables/core/useGsap/useGsap");

    try {
      await freshUseGsap().loadGsap();
    } catch {
      gsapImportState.shouldFail = false;
    }

    await expect(freshUseGsap().loadGsap()).resolves.toBeDefined();
  });
});