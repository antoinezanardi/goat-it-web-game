import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { validateDataTableAndGetRows } from "#acceptance/features/support/helpers/datatable.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

import { SEO_META_TAG_ROW_SCHEMA } from "./datatables/seo.datatables.schemas.ts";

Then(
  /^the following meta tags should be present:$/u,
  async function(this: GoatItWorld, dataTable: DataTable): Promise<void> {
    const rows = validateDataTableAndGetRows(dataTable, SEO_META_TAG_ROW_SCHEMA);

    for (const row of rows) {
      // Acceptable as each meta tag assertion must be awaited sequentially to verify its content
      // oxlint-disable-next-line eslint/no-await-in-loop
      await expect(this.page.locator(row.type === "name" ? `head meta[name="${row.key}"]` : `head meta[property="${row.key}"]`)).toHaveAttribute("content", row.content);
    }
  },
);

Then(
  /^the page should contain schema.org Website structured data$/u,
  async function(this: GoatItWorld): Promise<void> {
    const scriptLocator = this.page.locator("script[type=\"application/ld+json\"]");

    await expect(scriptLocator.first()).toBeAttached();

    const jsonContent = await scriptLocator.first().textContent();

    if (jsonContent === null) {
      throw new Error("Expected the schema.org JSON-LD script to have text content.");
    }

    // Acceptable as JSON.parse returns any and the schema.org script shape is validated at runtime
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const parsed = JSON.parse(jsonContent) as { "@graph"?: { "@type"?: string | string[] }[] };

    expect(parsed["@graph"]).toBeDefined();

    const graphTypes = (parsed["@graph"] ?? []).flatMap(node => node["@type"] ?? []);

    expect(graphTypes).toContain("WebSite");
  },
);