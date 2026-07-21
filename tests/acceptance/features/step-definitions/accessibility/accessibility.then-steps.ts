import { AxeBuilder } from "@axe-core/playwright";
import { Then } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ACCESSIBILITY_IGNORE_ROW_SCHEMA } from "#acceptance/features/step-definitions/accessibility/datatables/accessibility.datatables.schemas.ts";
import { validateDataTableAndGetRows } from "#acceptance/features/support/helpers/datatable.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import {
  AXE_TAGS,
  CSS_ANIMATION_SETTLE_MS,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
} from "#acceptance/features/step-definitions/accessibility/accessibility.steps.constants.ts";
import { prettyStringify } from "#acceptance/features/support/helpers/format.helpers.ts";

Then(
  /^the page should not contain accessibility issues in (?<mode>desktop|mobile) mode$/u,
  { timeout: 10_000 },
  async function(this: GoatItWorld, mode: "desktop" | "mobile"): Promise<void> {
    await checkAccessibility(this, mode);
  },
);

Then(
  /^the page should not contain accessibility issues in (?<mode>desktop|mobile) mode ignoring the following:$/u,
  { timeout: 10_000 },
  async function(this: GoatItWorld, mode: "desktop" | "mobile", dataTable: DataTable): Promise<void> {
    const rows = validateDataTableAndGetRows(dataTable, ACCESSIBILITY_IGNORE_ROW_SCHEMA);
    const ignoredViolations = rows.map(row => row.violation);

    await checkAccessibility(this, mode, ignoredViolations);
  },
);

async function checkAccessibility(world: GoatItWorld, mode: "desktop" | "mobile", ignoredViolations: string[] = []): Promise<void> {
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