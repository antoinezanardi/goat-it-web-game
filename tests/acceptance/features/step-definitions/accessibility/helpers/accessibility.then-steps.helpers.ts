import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { prettyStringify } from "#acceptance/features/support/helpers/format.helpers.ts";
import {
  AXE_TAGS,
  CSS_ANIMATION_SETTLE_MS,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
} from "#acceptance/features/step-definitions/accessibility/accessibility.steps.constants.ts";

async function checkAccessibility(world: GoatItWorld, mode: "desktop" | "mobile", ignoredViolations: string[]): Promise<void> {
  const viewport = mode === "desktop" ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT;

  await world.page.setViewportSize(viewport);
  await world.page.waitForLoadState("networkidle");
  await world.page.waitForTimeout(CSS_ANIMATION_SETTLE_MS);
  const results = await new AxeBuilder({ page: world.page })
    .setLegacyMode()
    .withTags([...AXE_TAGS])
    .exclude("input[data-hidden]")
    .exclude("[role='switch'][data-slot='base'][data-state]")
    .analyze();

  const violationsToReport = results.violations.filter(violation => !ignoredViolations.includes(violation.id));

  if (violationsToReport.length > 0) {
    console.error(`Accessibility violations:\n${prettyStringify(violationsToReport)}`);
  }
  expect(violationsToReport).toHaveLength(0);
}

export {
  checkAccessibility,
};