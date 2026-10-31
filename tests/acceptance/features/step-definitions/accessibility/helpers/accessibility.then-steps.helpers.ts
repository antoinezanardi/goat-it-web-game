import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { prettyStringify } from "#acceptance/features/support/helpers/format.helpers.ts";
import {
  AXE_TAGS,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
} from "#acceptance/features/step-definitions/accessibility/accessibility.steps.constants.ts";

async function waitForAnimationsToSettle(world: GoatItWorld): Promise<void> {
  await world.page.waitForFunction((): boolean => document.getAnimations().every(animation => {
    const iterations = animation.effect?.getTiming().iterations;
    const isInfinite = !Number.isFinite(iterations ?? 1);

    return isInfinite || animation.playState !== "running";
  }));
}

async function checkAccessibility(world: GoatItWorld, mode: "desktop" | "mobile"): Promise<void> {
  const viewport = mode === "desktop" ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT;

  await world.page.setViewportSize(viewport);
  await world.page.waitForLoadState("networkidle");
  await waitForAnimationsToSettle(world);
  const results = await new AxeBuilder({ page: world.page })
    .withTags([...AXE_TAGS])
    .exclude("input[data-hidden]")
    .analyze();

  if (results.violations.length > 0) {
    console.error(`Accessibility violations:\n${prettyStringify(results.violations)}`);
  }
  expect(results.violations).toHaveLength(0);
}

export {
  checkAccessibility,
};