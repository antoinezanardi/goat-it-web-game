import { Then } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";

import { ACCESSIBILITY_IGNORE_ROW_SCHEMA } from "#acceptance/features/step-definitions/accessibility/datatables/accessibility.datatables.schemas.ts";
import { checkAccessibility } from "#acceptance/features/step-definitions/accessibility/helpers/accessibility.then-steps.helpers.ts";
import { validateDataTableAndGetRows } from "#acceptance/features/support/helpers/datatable.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the page should not contain accessibility issues in (?<mode>desktop|mobile) mode$/u,
  { timeout: 10_000 },
  async function(this: GoatItWorld, mode: "desktop" | "mobile"): Promise<void> {
    await checkAccessibility(this, mode, []);
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