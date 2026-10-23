import { beforeEach, describe, expect, it } from "vitest";

import type { useGsap as UseGsapType } from "@/composables/core/useGsap/useGsap";

let useGsap: typeof UseGsapType;

describe("useGsap", () => {
  beforeEach(async() => {
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
});